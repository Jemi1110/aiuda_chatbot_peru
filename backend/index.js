require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Initialize Supabase clients
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/api/stack-ai', async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('Received auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Invalid auth header format:', authHeader);
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', {
      length: token.length,
      startsWith: token.startsWith('eyJ'), // JWT token starts with eyJ
      endsWith: token.endsWith('==')
    });

    // Create Supabase client with user token
    const supabaseUser = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    supabaseUser.auth.setAuth(token);

    // Verify token
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Get the message from the request body
    console.log('Request body received:', req.body);
    const { "in-1": content } = req.body;
    if (!content) {
      console.error('No content found in request body:', req.body);
      return res.status(400).json({
        success: false,
        error: 'Missing message content'
      });
    }

    // Get or create chat
    let chatData;
    const { data: existingChat, error: chatError } = await supabaseAdmin
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (chatError && chatError.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        error: 'Error getting chat data'
      });
    }

    if (!existingChat) {
      const { data: newChat, error: newChatError } = await supabaseAdmin
        .from('chats')
        .insert({
          title: `Chat ${new Date().toISOString().split('T')[0]}`,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (newChatError) {
        return res.status(500).json({
          success: false,
          error: 'Error creating new chat'
        });
      }

      chatData = newChat;
    } else {
      chatData = existingChat;
    }

    // Call Stack AI API with in-1
    const stackAiInput = {
      "in-1": content
    };

    console.log('Sending to Stack AI:', {
      input: stackAiInput,
      url: process.env.STACK_AI_API_URL,
      headers: {
        'Authorization': '***', // No mostrar la clave real en logs
        'Content-Type': 'application/json'
      }
    });

    try {
      const stackAiResponse = await axios({
        method: 'post',
        url: process.env.STACK_AI_API_URL,
        data: stackAiInput,
        headers: {
          'Authorization': `Bearer ${process.env.STACK_AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });
    } catch (error) {
      console.error('Error calling Stack AI:', error);
      throw error;
    }

      console.log('Stack AI response received:', {
        status: stackAiResponse.status,
        statusText: stackAiResponse.statusText,
        data: stackAiResponse.data
      });

      // Process Stack AI response (expecting out-0)
      const responseContent = stackAiResponse.data.outputs?.['out-0'];
      if (!responseContent) {
        console.error('No response content found in Stack AI response:', {
          outputs: stackAiResponse.data.outputs
        });
        throw new Error('No response content found in Stack AI response');
      }

      console.log('Successfully got response content:', {
        length: responseContent.length,
        preview: responseContent.substring(0, 50)
      });

    // Process Stack AI response (expecting out-0)
    const botResponse = stackAiResponse.data.outputs['out-0'];
    if (!botResponse) {
      console.error('No response content found in Stack AI response:', {
        outputs: stackAiResponse.data.outputs
      });
      throw new Error('No response content found in Stack AI response');
    }

    console.log('Successfully got response content:', {
      length: botResponse.length,
      preview: botResponse.substring(0, 50)
    });

    // Save messages to database
    const { data: userMessage, error: userError } = await supabaseAdmin
      .from('chat_history')
      .insert({
        content: content,
        sender: 'user',
        chat_id: chatData.id,
        user_id: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (userError) {
      return res.status(500).json({
        success: false,
        error: 'Error saving user message'
      });
    }

    const { data: botMessage, error: botError } = await supabaseAdmin
      .from('chat_history')
      .insert({
        content: botResponse,
        sender: 'bot',
        chat_id: chatData.id,
        user_id: user.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (botError) {
      return res.status(500).json({
        success: false,
        error: 'Error saving bot message'
      });
    }

    // Prepare response for frontend
    const response = {
      success: true,
      chat_id: chatData.id,
      messages: [
        {
          id: userMessage.id,
          content: userMessage.content,
          sender: 'user',
          created_at: userMessage.created_at
        },
        {
          id: botMessage.id,
          content: responseContent,
          sender: 'bot',
          created_at: botMessage.created_at
        }
      ]
    };

    res.json(response);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get chat history
app.get('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    const supabaseUser = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    supabaseUser.auth.setAuth(token);

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('chat_history')
      .select('*')
      .eq('chat_id', chatId)
      .eq('user_id', user.id)
      .order('created_at');

    if (messagesError) {
      return res.status(500).json({
        success: false,
        error: 'Error getting chat history'
      });
    }

    res.json({
      success: true,
      messages: messages
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
