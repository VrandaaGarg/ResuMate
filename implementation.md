# ResuMate - Resume Parsing Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Core Components](#core-components)
5. [API Endpoints](#api-endpoints)
6. [OpenAI Integration](#openai-integration)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Overview

ResuMate is a comprehensive resume management application that leverages OpenAI's GPT models to parse, analyze, and enhance resumes. The system supports multiple file formats (PDF, DOCX, DOC, TXT) and provides features like:

- **Resume Parsing**: Extract structured data from uploaded resume files
- **ATS Compatibility Analysis**: Analyze resumes for Applicant Tracking System compatibility
- **Job Description Matching**: Compare resumes against job descriptions
- **Bullet Point Enhancement**: Improve resume bullet points with AI

## Architecture

### High-Level Architecture
```
Frontend (React) → API Layer (Express) → OpenAI Services → Database (Firebase)
                                      ↓
                              File Storage (Appwrite)
```

### Technology Stack
- **Frontend**: React 19, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express.js
- **AI/ML**: OpenAI GPT-4.1-mini-2025-04-14, Assistants API
- **Database**: Firebase Firestore
- **File Storage**: Appwrite
- **Deployment**: Vercel (Serverless)

## File Structure

```
ResuMate/
├── src/
│   ├── Components/
│   │   └── ResumeUploadModal.jsx     # File upload interface
│   ├── utils/
│   │   └── ai.js                     # Frontend AI utilities
│   └── services/
│       └── fileStorage.js            # File upload services
├── api/
│   ├── enhance.js                    # Main API router
│   ├── enhance-bullet.js             # Bullet enhancement endpoint
│   ├── jd-match.js                   # Job matching endpoint
│   └── ats-score.js                  # ATS scoring endpoint
├── config/
│   └── openai.js                     # OpenAI service implementations
├── server.js                         # Express server setup
└── implementation.md                 # This document
```

## Core Components

### 1. File Upload System

**Location**: `src/Components/ResumeUploadModal.jsx`

**Features**:
- Drag & drop file upload
- File validation (type, size)
- Progress tracking
- Multiple processing options

**Supported File Types**:
- PDF (`.pdf`)
- Microsoft Word (`.docx`, `.doc`)
- Plain Text (`.txt`)

**File Size Limit**: 10MB

### 2. Resume Parsing Engine

**Location**: `config/openai.js` → `parseResumeFromFile()`

**Process Flow**:
1. Download file from URL
2. Upload to OpenAI Files API
3. Create vector store with file
4. Create assistant with file_search tool
5. Process resume through assistant
6. Extract structured JSON data
7. Cleanup resources

**Output Schema**:
```json
{
  "name": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "websiteURL": "string"
  },
  "skills": [
    {
      "domain": "string",
      "languages": ["string"]
    }
  ],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "technologies": "string",
      "years": "string",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "github": "string",
      "demo": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "specialization": "string",
      "location": "string",
      "duration": "string",
      "gpa": "string",
      "school": "string",
      "tenth": "string",
      "twelfth": "string"
    }
  ],
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "year": "string",
      "month": "string"
    }
  ]
}
```

### 3. ATS Compatibility Analyzer

**Location**: `config/openai.js` → `checkATSFromFile()`

**Analysis Areas**:
- Formatting compatibility
- Keyword optimization
- Section structure
- File format suitability
- Content organization

**Output Schema**:
```json
{
  "atsScore": 85,
  "overallFeedback": "string",
  "sectionWiseFeedback": {
    "contact": "string",
    "experience": "string",
    "skills": "string"
  },
  "keywordOptimization": {
    "presentKeywords": ["string"],
    "missingKeywords": ["string"],
    "suggestions": ["string"]
  },
  "formattingIssues": ["string"],
  "generalTips": ["string"]
}
```

### 4. Job Description Matching

**Location**: `config/openai.js` → `jobMatching()`

**Features**:
- Skill gap analysis
- Match percentage calculation
- Improvement recommendations
- Keyword alignment

**Input Parameters**:
- `style`: "concise" | "elaborative"
- `jobDescription`: string
- `resume`: object

## API Endpoints

### 1. Resume Parsing
```
POST /api/parse-resume
Content-Type: application/json

Body:
{
  "fileUrl": "string"
}

Response:
{
  "success": true,
  "data": { /* parsed resume object */ }
}
```

### 2. ATS Analysis
```
POST /api/ats-check-file
Content-Type: application/json

Body:
{
  "fileUrl": "string"
}

Response:
{
  "success": true,
  "data": { /* ATS analysis object */ }
}
```

### 3. Job Matching
```
POST /api/jd-match
Content-Type: application/json

Body:
{
  "style": "concise",
  "jobDescription": "string",
  "resume": { /* resume object */ }
}

Response:
{
  "matchPercentage": 75,
  "skillGapAnalysis": { /* analysis object */ },
  "recommendations": ["string"]
}
```

### 4. Bullet Enhancement
```
POST /api/enhance-bullet
Content-Type: application/json

Body:
{
  "text": "string"
}

Response:
{
  "result": "enhanced bullet point text"
}
```

### 5. ATS Scoring
```
POST /api/ats-score
Content-Type: application/json

Body:
{ /* resume object */ }

Response:
{
  "atsScore": 85,
  "feedback": "string",
  /* additional analysis */
}
```

## OpenAI Integration

### Model Configuration
- **Primary Model**: `gpt-4.1-mini-2025-04-14`
- **API Version**: Latest
- **Temperature**: 0.1-0.7 (depending on use case)
- **Max Tokens**: 1200-4000 (depending on complexity)

### Assistants API Implementation

The OpenAI Assistants API is the backbone of ResuMate's document processing capabilities. It provides sophisticated document understanding through a combination of file processing, vector storage, and conversational AI.

#### **Core Architecture Components**

**1. Assistant Creation & Configuration**
```javascript
const assistant = await openai.beta.assistants.create({
  name: "Resume Parser",
  instructions: `${systemPrompt}`,
  model: "gpt-4.1-mini-2025-04-14",
  tools: [{ type: "file_search" }],
  temperature: 0.1,
  top_p: 1.0
});
```

**Key Configuration Parameters**:
- **Model**: `gpt-4.1-mini-2025-04-14` - Optimized for structured output
- **Tools**: `file_search` - Enables document analysis and retrieval
- **Temperature**: `0.1` - Low for consistent, accurate parsing
- **Instructions**: Detailed system prompt for parsing behavior

**2. Vector Store Management**

Vector stores are the foundation of document understanding in the Assistants API:

```javascript
// Create vector store with uploaded file
const vectorStore = await openai.vectorStores.create({
  name: "Resume Analysis",
  file_ids: [uploadedFile.id],
  expires_after: {
    anchor: "last_active_at",
    days: 1
  }
});
```

**Vector Store Features**:
- **Automatic Chunking**: Documents are automatically split into searchable chunks
- **Embedding Generation**: Each chunk is converted to vector embeddings
- **Semantic Search**: Enables context-aware document retrieval
- **Multi-format Support**: PDF, DOCX, DOC, TXT, MD files
- **Automatic Expiration**: Resources cleanup after specified time

**3. File Search Tool Integration**

The file_search tool enables the assistant to query and analyze uploaded documents:

```javascript
// Link vector store to assistant
await openai.beta.assistants.update(assistant.id, {
  tool_resources: {
    file_search: {
      vector_store_ids: [vectorStore.id],
      max_num_results: 20  // Maximum search results per query
    }
  }
});
```

**File Search Capabilities**:
- **Semantic Retrieval**: Finds relevant content based on meaning
- **Keyword Matching**: Traditional text search capabilities
- **Context Preservation**: Maintains document structure understanding
- **Multi-document Support**: Can search across multiple files simultaneously

**4. Thread and Message Management**

Threads provide conversational context for document analysis:

```javascript
const thread = await openai.beta.threads.create({
  messages: [{
    role: "user",
    content: "Analyze the uploaded resume and extract structured data according to the specified JSON format.",
    attachments: [{
      file_id: uploadedFile.id,
      tools: [{ type: "file_search" }]
    }]
  }]
});
```

**Thread Benefits**:
- **Conversation History**: Maintains context across multiple interactions
- **File Attachments**: Direct file association with messages
- **Tool Invocation**: Automatic file_search tool usage
- **Stateful Processing**: Remembers previous analysis steps

#### **Advanced Vector Store Operations**

**1. Chunking Strategy Configuration**
```javascript
const vectorStore = await openai.vectorStores.create({
  name: "Resume Analysis",
  file_ids: [uploadedFile.id],
  chunking_strategy: {
    type: "static",
    static: {
      max_chunk_size_tokens: 800,
      chunk_overlap_tokens: 400
    }
  }
});
```

**Chunking Parameters**:
- **max_chunk_size_tokens**: Maximum tokens per chunk (800 optimal for resumes)
- **chunk_overlap_tokens**: Overlap between chunks (400 for context preservation)
- **type**: "static" for consistent chunking, "auto" for dynamic

**2. File Processing Status Monitoring**
```javascript
// Poll file processing status
const checkFileStatus = async (vectorStoreId, fileId) => {
  let status = 'in_progress';

  while (status === 'in_progress') {
    const file = await openai.vectorStores.files.retrieve(fileId, {
      vector_store_id: vectorStoreId
    });

    status = file.status;

    if (status === 'failed') {
      throw new Error(`File processing failed: ${file.last_error?.message}`);
    }

    if (status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return status;
};
```

**File Processing States**:
- **in_progress**: File is being processed and chunked
- **completed**: File is ready for search operations
- **failed**: Processing failed (check last_error for details)
- **cancelled**: Processing was cancelled

**3. Vector Store File Batch Operations**
```javascript
// For multiple file processing
const fileBatch = await openai.vectorStores.fileBatches.create(vectorStoreId, {
  file_ids: [file1.id, file2.id, file3.id]
});

// Poll batch status
const batchStatus = await openai.vectorStores.fileBatches.poll(
  vectorStoreId,
  fileBatch.id
);
```

#### **Run Execution and Polling**

**1. Advanced Run Configuration**
```javascript
const run = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: assistant.id,
  instructions: "Focus on extracting education and experience sections with high accuracy.",
  additional_instructions: "If any section is unclear, indicate uncertainty in the response.",
  max_prompt_tokens: 4000,
  max_completion_tokens: 2000,
  truncation_strategy: {
    type: "last_messages",
    last_messages: 10
  }
});
```

**Run Configuration Options**:
- **instructions**: Override assistant's default instructions
- **additional_instructions**: Append to existing instructions
- **max_prompt_tokens**: Limit input token usage
- **max_completion_tokens**: Limit output token usage
- **truncation_strategy**: Handle long conversations

**2. Run Status Monitoring with Detailed Logging**
```javascript
const pollRunStatus = async (threadId, runId) => {
  let run = await openai.beta.threads.runs.retrieve(threadId, runId);

  console.log(`🏃 Run ${runId} status: ${run.status}`);

  while (['queued', 'in_progress', 'requires_action'].includes(run.status)) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    run = await openai.beta.threads.runs.retrieve(threadId, runId);

    console.log(`🔄 Run status update: ${run.status}`);

    // Handle tool calls if required
    if (run.status === 'requires_action') {
      const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
      console.log(`🔧 Tool calls required: ${toolCalls.length}`);

      // Process tool calls (file_search is handled automatically)
      // This is mainly for custom function calls
    }
  }

  if (run.status === 'failed') {
    console.error(`❌ Run failed: ${run.last_error?.message}`);
    throw new Error(`Run failed: ${run.last_error?.message}`);
  }

  console.log(`✅ Run completed with status: ${run.status}`);
  return run;
};
```

**Run Status Types**:
- **queued**: Run is waiting to be processed
- **in_progress**: Run is actively being processed
- **requires_action**: Run needs tool outputs or user input
- **cancelling**: Run is being cancelled
- **cancelled**: Run was cancelled
- **failed**: Run failed with an error
- **completed**: Run finished successfully
- **expired**: Run timed out

#### **Resource Management and Cleanup**

**1. Comprehensive Cleanup Strategy**
```javascript
const cleanupResources = async (assistant, vectorStore, uploadedFile) => {
  const cleanupTasks = [];

  try {
    // Delete assistant
    if (assistant?.id) {
      cleanupTasks.push(
        openai.beta.assistants.delete(assistant.id)
          .then(() => console.log(`✅ Deleted assistant: ${assistant.id}`))
          .catch(err => console.warn(`⚠️ Failed to delete assistant: ${err.message}`))
      );
    }

    // Delete vector store (this also deletes associated files)
    if (vectorStore?.id) {
      cleanupTasks.push(
        openai.vectorStores.delete(vectorStore.id)
          .then(() => console.log(`✅ Deleted vector store: ${vectorStore.id}`))
          .catch(err => console.warn(`⚠️ Failed to delete vector store: ${err.message}`))
      );
    }

    // Delete uploaded file
    if (uploadedFile?.id) {
      cleanupTasks.push(
        openai.files.delete(uploadedFile.id)
          .then(() => console.log(`✅ Deleted file: ${uploadedFile.id}`))
          .catch(err => console.warn(`⚠️ Failed to delete file: ${err.message}`))
      );
    }

    // Execute all cleanup tasks in parallel
    await Promise.allSettled(cleanupTasks);
    console.log("🧹 Resource cleanup completed");

  } catch (error) {
    console.error("❌ Cleanup error:", error);
    // Don't throw - cleanup failures shouldn't break the main flow
  }
};
```

**2. Automatic Resource Expiration**
```javascript
// Set automatic expiration for vector stores
const vectorStore = await openai.vectorStores.create({
  name: "Resume Analysis",
  file_ids: [uploadedFile.id],
  expires_after: {
    anchor: "last_active_at",  // or "created_at"
    days: 1  // Automatically delete after 1 day of inactivity
  }
});
```

**Benefits of Assistants API Architecture**:
- **Document Understanding**: Superior comprehension of complex document layouts
- **Multi-format Support**: Handles PDF, DOCX, DOC, TXT seamlessly
- **Semantic Search**: Finds relevant information based on meaning, not just keywords
- **Structured Output**: Consistent JSON formatting with high accuracy
- **Scalable Processing**: Handles documents of varying sizes and complexity
- **Resource Efficiency**: Automatic cleanup prevents resource leaks
- **Error Resilience**: Robust error handling and recovery mechanisms

## Vector Store Deep Dive

### Vector Store Architecture

Vector stores are the foundation of document understanding in ResuMate. They convert documents into searchable vector embeddings that enable semantic understanding and retrieval.

#### **Vector Store Lifecycle**

**1. Creation and Configuration**
```javascript
const createOptimizedVectorStore = async (fileId, fileName) => {
  const vectorStore = await openai.vectorStores.create({
    name: `Resume_Analysis_${Date.now()}`,
    file_ids: [fileId],

    // Chunking strategy for resume documents
    chunking_strategy: {
      type: "static",
      static: {
        max_chunk_size_tokens: 800,    // Optimal for resume sections
        chunk_overlap_tokens: 400      // Preserve context between chunks
      }
    },

    // Automatic cleanup after 24 hours
    expires_after: {
      anchor: "last_active_at",
      days: 1
    },

    // Metadata for tracking
    metadata: {
      purpose: "resume_parsing",
      file_name: fileName,
      created_at: new Date().toISOString()
    }
  });

  console.log(`📚 Created vector store: ${vectorStore.id}`);
  return vectorStore;
};
```

**2. File Processing and Status Monitoring**
```javascript
const monitorFileProcessing = async (vectorStoreId, fileId) => {
  console.log(`📄 Processing file ${fileId} in vector store ${vectorStoreId}`);

  let attempts = 0;
  const maxAttempts = 60; // 60 seconds timeout

  while (attempts < maxAttempts) {
    try {
      const vectorStoreFile = await openai.vectorStores.files.retrieve(
        vectorStoreId,
        fileId
      );

      console.log(`🔄 File processing status: ${vectorStoreFile.status}`);

      switch (vectorStoreFile.status) {
        case 'completed':
          console.log(`✅ File processing completed`);
          console.log(`📊 Usage: ${vectorStoreFile.usage?.total_bytes} bytes processed`);
          return vectorStoreFile;

        case 'failed':
          const error = vectorStoreFile.last_error;
          console.error(`❌ File processing failed: ${error?.message}`);
          throw new Error(`File processing failed: ${error?.message || 'Unknown error'}`);

        case 'cancelled':
          throw new Error('File processing was cancelled');

        case 'in_progress':
          console.log(`⏳ Processing... (attempt ${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
          break;

        default:
          console.log(`🔄 Status: ${vectorStoreFile.status}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
      }
    } catch (error) {
      console.error(`❌ Error checking file status: ${error.message}`);
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error('File processing timeout - exceeded maximum wait time');
};
```

**3. Vector Store Optimization for Resume Parsing**
```javascript
const optimizeVectorStoreForResumes = {
  // Chunking strategy optimized for resume sections
  chunkingStrategy: {
    type: "static",
    static: {
      max_chunk_size_tokens: 800,     // Captures full resume sections
      chunk_overlap_tokens: 400       // Maintains context between sections
    }
  },

  // Search configuration for resume content
  searchConfig: {
    max_num_results: 20,              // Retrieve more results for comprehensive analysis
    score_threshold: 0.7              // Higher threshold for relevant content
  },

  // File type specific optimizations
  fileTypeOptimizations: {
    'application/pdf': {
      max_chunk_size_tokens: 1000,    // PDFs can handle larger chunks
      chunk_overlap_tokens: 500
    },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      max_chunk_size_tokens: 800,     // DOCX optimal size
      chunk_overlap_tokens: 400
    },
    'text/plain': {
      max_chunk_size_tokens: 600,     // Smaller chunks for plain text
      chunk_overlap_tokens: 300
    }
  }
};
```

#### **Advanced Vector Store Operations**

**1. Multi-File Vector Store Management**
```javascript
const createMultiFileVectorStore = async (fileIds, purpose = "resume_analysis") => {
  // Create vector store
  const vectorStore = await openai.vectorStores.create({
    name: `Multi_Resume_Analysis_${Date.now()}`,
    expires_after: {
      anchor: "last_active_at",
      days: 2  // Longer expiration for batch processing
    }
  });

  // Add files in batches for better performance
  const batchSize = 10;
  const fileBatches = [];

  for (let i = 0; i < fileIds.length; i += batchSize) {
    const batch = fileIds.slice(i, i + batchSize);
    fileBatches.push(batch);
  }

  for (const batch of fileBatches) {
    const fileBatch = await openai.vectorStores.fileBatches.create(vectorStore.id, {
      file_ids: batch
    });

    console.log(`📦 Created file batch: ${fileBatch.id} with ${batch.length} files`);

    // Poll batch completion
    const completedBatch = await openai.vectorStores.fileBatches.poll(
      vectorStore.id,
      fileBatch.id
    );

    console.log(`✅ Batch completed: ${completedBatch.file_counts.completed}/${completedBatch.file_counts.total} files processed`);
  }

  return vectorStore;
};
```

**2. Vector Store Search and Retrieval**
```javascript
const searchVectorStore = async (vectorStoreId, query, options = {}) => {
  const searchOptions = {
    max_num_results: options.maxResults || 20,
    score_threshold: options.scoreThreshold || 0.7,
    ...options
  };

  try {
    // Note: Direct vector store search is not available in the API
    // Search happens automatically through the file_search tool in assistants
    // This is a conceptual example of how search would work

    console.log(`🔍 Searching vector store ${vectorStoreId} for: "${query}"`);
    console.log(`📊 Search options:`, searchOptions);

    // The actual search happens when the assistant uses the file_search tool
    // Results are automatically incorporated into the assistant's response

  } catch (error) {
    console.error(`❌ Vector store search error: ${error.message}`);
    throw error;
  }
};
```

**3. Vector Store Analytics and Monitoring**
```javascript
const analyzeVectorStorePerformance = async (vectorStoreId) => {
  try {
    const vectorStore = await openai.vectorStores.retrieve(vectorStoreId);

    const analytics = {
      id: vectorStore.id,
      name: vectorStore.name,
      status: vectorStore.status,
      file_counts: vectorStore.file_counts,
      usage_bytes: vectorStore.usage_bytes,
      created_at: vectorStore.created_at,
      expires_at: vectorStore.expires_at,
      last_active_at: vectorStore.last_active_at
    };

    console.log(`📊 Vector Store Analytics:`, analytics);

    // Calculate efficiency metrics
    const efficiency = {
      files_per_mb: vectorStore.file_counts.total / (vectorStore.usage_bytes / 1024 / 1024),
      processing_time: vectorStore.last_active_at - vectorStore.created_at,
      success_rate: vectorStore.file_counts.completed / vectorStore.file_counts.total
    };

    console.log(`⚡ Efficiency Metrics:`, efficiency);

    return { analytics, efficiency };
  } catch (error) {
    console.error(`❌ Analytics error: ${error.message}`);
    throw error;
  }
};
```

#### **Vector Store Best Practices**

**1. Chunking Strategy Selection**
```javascript
const selectChunkingStrategy = (fileType, fileSize) => {
  const strategies = {
    // For small resume files (< 100KB)
    small: {
      max_chunk_size_tokens: 600,
      chunk_overlap_tokens: 300
    },

    // For medium resume files (100KB - 1MB)
    medium: {
      max_chunk_size_tokens: 800,
      chunk_overlap_tokens: 400
    },

    // For large resume files (> 1MB)
    large: {
      max_chunk_size_tokens: 1000,
      chunk_overlap_tokens: 500
    },

    // For multi-page detailed resumes
    detailed: {
      max_chunk_size_tokens: 1200,
      chunk_overlap_tokens: 600
    }
  };

  if (fileSize < 100 * 1024) return strategies.small;
  if (fileSize < 1024 * 1024) return strategies.medium;
  if (fileSize < 5 * 1024 * 1024) return strategies.large;
  return strategies.detailed;
};
```

**2. Error Handling and Recovery**
```javascript
const robustVectorStoreCreation = async (fileId, retryCount = 3) => {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      console.log(`🔄 Vector store creation attempt ${attempt}/${retryCount}`);

      const vectorStore = await openai.vectorStores.create({
        name: `Resume_Analysis_${Date.now()}_Attempt_${attempt}`,
        file_ids: [fileId],
        expires_after: {
          anchor: "last_active_at",
          days: 1
        }
      });

      // Wait for file processing
      await monitorFileProcessing(vectorStore.id, fileId);

      console.log(`✅ Vector store created successfully on attempt ${attempt}`);
      return vectorStore;

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed: ${error.message}`);

      if (attempt === retryCount) {
        throw new Error(`Failed to create vector store after ${retryCount} attempts: ${error.message}`);
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

**3. Resource Optimization**
```javascript
const optimizeVectorStoreUsage = {
  // Reuse vector stores for similar operations
  reuseStrategy: {
    enabled: true,
    maxAge: 3600000, // 1 hour
    maxFiles: 5      // Maximum files per vector store
  },

  // Cleanup strategy
  cleanupStrategy: {
    autoCleanup: true,
    cleanupInterval: 1800000, // 30 minutes
    maxIdleTime: 3600000      // 1 hour idle time
  },

  // Performance monitoring
  monitoring: {
    trackUsage: true,
    logPerformance: true,
    alertThresholds: {
      processingTime: 30000,    // 30 seconds
      failureRate: 0.1          // 10% failure rate
    }
  }
};
```

## Assistant Prompt Engineering for Resume Parsing

### Optimized System Prompts

The quality of resume parsing heavily depends on well-crafted system prompts that guide the assistant's behavior.

#### **Core Resume Parsing Prompt**
```javascript
const createResumeParsingPrompt = () => {
  return `You are an expert resume parser and data extraction specialist with deep understanding of various resume formats, layouts, and industry standards.

CORE RESPONSIBILITIES:
1. Extract ONLY actual information present in the uploaded resume document
2. Structure data according to the specified JSON schema with high accuracy
3. Preserve original context and meaning while standardizing format
4. Handle various resume layouts (chronological, functional, hybrid)
5. Recognize and extract information from different sections regardless of naming conventions

CRITICAL PARSING RULES:
- Do NOT generate sample, placeholder, or fictional data
- If information is not present, use empty strings "" or empty arrays []
- Pay special attention to EDUCATION section - extract ALL educational qualifications
- Look for education in various formats: degrees, certifications, courses, schools, colleges, universities
- Extract education details even if they appear in different sections or formats
- Preserve exact company names, job titles, and technical terms
- Maintain chronological order where apparent
- Extract skills from multiple sections (skills, experience, projects)
- Identify and separate technical skills from soft skills

SECTION-SPECIFIC INSTRUCTIONS:

CONTACT INFORMATION:
- Extract email, phone, location, LinkedIn, GitHub, personal website
- Standardize phone numbers to consistent format
- Clean up URLs (remove tracking parameters)
- Handle international phone formats

EXPERIENCE SECTION:
- Extract role, company, duration, location, description
- Identify technologies and tools mentioned
- Preserve bullet points structure in description
- Calculate years of experience when possible
- Handle various date formats (MM/YYYY, Month Year, etc.)

EDUCATION SECTION:
- Extract institution, degree, specialization, location, duration, GPA
- Handle various degree formats (BS, Bachelor of Science, B.S., etc.)
- Extract both formal education and certifications
- Include relevant coursework if mentioned
- Handle incomplete education (in progress, expected graduation)

SKILLS SECTION:
- Categorize skills by domain (Programming, Frameworks, Tools, etc.)
- Extract skills from experience descriptions
- Identify skill levels when mentioned
- Group related technologies together

PROJECTS SECTION:
- Extract project name, description, technologies used
- Identify GitHub links, demo links, live URLs
- Preserve technical implementation details
- Extract project duration if mentioned

ACHIEVEMENTS SECTION:
- Extract awards, honors, publications, patents
- Include relevant dates and organizations
- Preserve achievement context and significance

OUTPUT FORMAT:
Return ONLY a valid JSON object with the following exact structure:

{
  "name": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "websiteURL": "string"
  },
  "skills": [
    {
      "domain": "string",
      "languages": ["string"]
    }
  ],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "technologies": "string",
      "years": "string",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "github": "string",
      "demo": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "specialization": "string",
      "location": "string",
      "duration": "string",
      "gpa": "string",
      "school": "string",
      "tenth": "string",
      "twelfth": "string"
    }
  ],
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "year": "string",
      "month": "string"
    }
  ]
}

QUALITY ASSURANCE:
- Ensure all extracted data is factually accurate to the source document
- Maintain consistency in formatting and structure
- Preserve important details while standardizing format
- Double-check that no placeholder data is included
- Validate that JSON structure is complete and valid`;
};
```

#### **ATS Analysis Prompt**
```javascript
const createATSAnalysisPrompt = () => {
  return `You are an expert ATS (Applicant Tracking System) analyzer with deep knowledge of how modern ATS systems parse, score, and rank resumes.

ANALYSIS OBJECTIVES:
1. Evaluate resume compatibility with major ATS systems (Workday, Greenhouse, Lever, etc.)
2. Identify formatting issues that could cause parsing problems
3. Analyze keyword optimization and relevance
4. Provide actionable improvement recommendations
5. Generate a comprehensive ATS compatibility score

ATS EVALUATION CRITERIA:

FORMATTING ANALYSIS (30% of score):
- File format compatibility (PDF vs DOCX preferences)
- Font readability and ATS-friendly fonts
- Section header recognition
- Table and column usage impact
- Graphics, images, and special characters
- Consistent formatting and spacing
- Bullet point structure and recognition

KEYWORD OPTIMIZATION (25% of score):
- Industry-relevant keyword density
- Technical skills keyword matching
- Job title and role keyword alignment
- Action verb usage and variety
- Acronym and full-form variations
- Context-appropriate keyword placement

CONTENT STRUCTURE (25% of score):
- Standard section naming conventions
- Logical information hierarchy
- Contact information placement and format
- Date format consistency
- Experience section organization
- Education section completeness

PARSING COMPATIBILITY (20% of score):
- Text extraction accuracy potential
- Special character handling
- Multi-column layout issues
- Header/footer content accessibility
- Embedded object compatibility
- Character encoding considerations

SCORING METHODOLOGY:
- Score range: 0-100 points
- 90-100: Excellent ATS compatibility
- 80-89: Good compatibility with minor improvements needed
- 70-79: Moderate compatibility with several improvements needed
- 60-69: Poor compatibility requiring significant changes
- Below 60: Major ATS compatibility issues

OUTPUT FORMAT:
Return ONLY a valid JSON object with this exact structure:

{
  "atsScore": number,
  "overallFeedback": "string",
  "sectionWiseFeedback": {
    "contact": "string",
    "experience": "string",
    "skills": "string",
    "education": "string",
    "formatting": "string"
  },
  "keywordOptimization": {
    "presentKeywords": ["string"],
    "missingKeywords": ["string"],
    "suggestions": ["string"]
  },
  "formattingIssues": ["string"],
  "generalTips": ["string"],
  "improvementPriority": {
    "high": ["string"],
    "medium": ["string"],
    "low": ["string"]
  }
}`;
};
```

#### **Job Matching Prompt**
```javascript
const createJobMatchingPrompt = (style = "concise") => {
  const basePrompt = `You are an expert career advisor and resume-job matching specialist with deep understanding of hiring processes and job requirements analysis.

MATCHING OBJECTIVES:
1. Analyze alignment between resume and job description
2. Identify skill gaps and strengths
3. Calculate realistic match percentage
4. Provide specific improvement recommendations
5. Suggest relevant keywords and skills to add

ANALYSIS METHODOLOGY:

SKILL MATCHING (40% weight):
- Technical skills alignment
- Required vs preferred skills coverage
- Skill level assessment
- Technology stack compatibility
- Industry-specific knowledge

EXPERIENCE RELEVANCE (30% weight):
- Role responsibility alignment
- Industry experience relevance
- Company size and type match
- Leadership and management experience
- Project complexity and scale

EDUCATION AND QUALIFICATIONS (15% weight):
- Degree requirements fulfillment
- Certification relevance
- Educational institution prestige
- Specialized training alignment

CULTURAL AND SOFT SKILLS FIT (15% weight):
- Communication skills demonstration
- Teamwork and collaboration evidence
- Problem-solving capabilities
- Adaptability and learning agility
- Leadership potential indicators`;

  const styleSpecificInstructions = {
    concise: `
RESPONSE STYLE: CONCISE
- Provide brief, actionable insights
- Focus on top 3-5 most important points
- Use bullet points for clarity
- Limit explanations to essential information
- Prioritize immediate actionable items`,

    elaborative: `
RESPONSE STYLE: ELABORATIVE
- Provide detailed analysis and explanations
- Include specific examples and evidence
- Offer comprehensive improvement strategies
- Explain reasoning behind recommendations
- Include industry context and trends
- Provide step-by-step improvement plans`
  };

  return basePrompt + styleSpecificInstructions[style] + `

OUTPUT FORMAT:
Return ONLY a valid JSON object with this structure:

{
  "matchPercentage": number,
  "overallAssessment": "string",
  "skillGapAnalysis": {
    "matchingSkills": ["string"],
    "missingSkills": ["string"],
    "partiallyMatchingSkills": ["string"]
  },
  "experienceAlignment": {
    "relevantExperience": ["string"],
    "experienceGaps": ["string"],
    "transferableSkills": ["string"]
  },
  "recommendations": {
    "immediate": ["string"],
    "shortTerm": ["string"],
    "longTerm": ["string"]
  },
  "keywordSuggestions": ["string"],
  "strengthsToHighlight": ["string"],
  "improvementAreas": ["string"]
}`;
};
```

### Assistant Configuration Optimization

#### **Model-Specific Configuration**
```javascript
const getOptimizedAssistantConfig = (taskType) => {
  const baseConfig = {
    model: "gpt-4.1-mini-2025-04-14",
    tools: [{ type: "file_search" }]
  };

  const taskConfigs = {
    resume_parsing: {
      ...baseConfig,
      temperature: 0.1,  // Low for accuracy and consistency
      top_p: 0.9,
      instructions: createResumeParsingPrompt(),
      name: "Resume Parser Specialist",
      description: "Expert at extracting structured data from resume documents"
    },

    ats_analysis: {
      ...baseConfig,
      temperature: 0.3,  // Slightly higher for analytical insights
      top_p: 0.95,
      instructions: createATSAnalysisPrompt(),
      name: "ATS Compatibility Analyzer",
      description: "Specialist in ATS system compatibility and optimization"
    },

    job_matching: {
      ...baseConfig,
      temperature: 0.5,  // Higher for creative recommendations
      top_p: 1.0,
      instructions: createJobMatchingPrompt("elaborative"),
      name: "Job Match Advisor",
      description: "Expert in resume-job description alignment analysis"
    },

    bullet_enhancement: {
      ...baseConfig,
      temperature: 0.7,  // Highest for creative writing
      top_p: 1.0,
      name: "Resume Enhancement Specialist",
      description: "Expert at improving resume bullet points and descriptions"
    }
  };

  return taskConfigs[taskType] || baseConfig;
};
```

#### **Dynamic Prompt Adaptation**
```javascript
const adaptPromptForFileType = (basePrompt, fileType, fileSize) => {
  let adaptedPrompt = basePrompt;

  // File type specific adaptations
  const fileTypeAdaptations = {
    'application/pdf': `
ADDITIONAL PDF-SPECIFIC INSTRUCTIONS:
- Handle potential OCR artifacts and text extraction issues
- Account for possible formatting inconsistencies from PDF conversion
- Pay attention to text that might be split across lines incorrectly
- Be aware of potential character encoding issues`,

    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': `
ADDITIONAL DOCX-SPECIFIC INSTRUCTIONS:
- Leverage the structured document format for better section identification
- Utilize formatting cues (bold, italic, bullet points) for content categorization
- Take advantage of table structures for organized information extraction
- Handle embedded objects and formatting elements appropriately`,

    'text/plain': `
ADDITIONAL TEXT-SPECIFIC INSTRUCTIONS:
- Rely on spacing and line breaks for section identification
- Use context clues for determining information hierarchy
- Handle minimal formatting with careful content analysis
- Pay attention to ASCII art or text-based formatting`
  };

  if (fileTypeAdaptations[fileType]) {
    adaptedPrompt += fileTypeAdaptations[fileType];
  }

  // File size specific adaptations
  if (fileSize > 1024 * 1024) { // > 1MB
    adaptedPrompt += `
LARGE FILE HANDLING:
- Process document systematically section by section
- Maintain attention to detail despite document length
- Ensure comprehensive extraction across all sections
- Handle potential complexity with thorough analysis`;
  }

  return adaptedPrompt;
};
```

### Error Handling Strategy

**API Error Types**:
- `400 Bad Request`: Invalid file format or missing parameters
- `401 Unauthorized`: Invalid API key
- `429 Rate Limit`: Too many requests
- `500 Internal Server Error`: Processing failures

**Retry Logic**:
- Exponential backoff for rate limits
- Automatic retry for transient failures
- Graceful degradation for non-critical features

**Logging**:
- Comprehensive console logging
- Error tracking with context
- Performance monitoring

## Testing

### Unit Tests
```bash
# Run individual function tests
npm test -- --grep "parseResumeFromFile"
npm test -- --grep "checkATSCompatibility"
```

### Integration Tests
```bash
# Test full API endpoints
npm run test:integration
```

### Manual Testing Checklist
- [ ] PDF file upload and parsing
- [ ] DOCX file upload and parsing
- [ ] Error handling for invalid files
- [ ] ATS analysis accuracy
- [ ] Job matching functionality
- [ ] Bullet point enhancement

## Deployment

### Environment Variables
```bash
# Required
OPENAI_API_KEY=sk-...
VITE_FIREBASE_API_KEY=...
VITE_APPWRITE_ENDPOINT=...
VITE_APPWRITE_PROJECT_ID=...
VITE_APPWRITE_BUCKET_ID=...

# Optional
VITE_API_BASE=/api
PORT=3001
NODE_ENV=production
```

### Vercel Deployment
```json
// vercel.json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### Performance Optimization
- **Serverless Functions**: Each API endpoint as separate function
- **Cold Start Mitigation**: Keep functions warm
- **Caching**: Response caching for static analysis
- **Resource Cleanup**: Automatic OpenAI resource deletion

## Troubleshooting

### Common Issues

**1. "Failed to parse resume" Error**
- **Cause**: Server using cached code or invalid API endpoint
- **Solution**: Restart server, check OpenAI API key

**2. "Invalid file type" Error**
- **Cause**: Unsupported file format or corrupted file
- **Solution**: Verify file format, check file integrity

**3. "Rate limit exceeded" Error**
- **Cause**: Too many API requests
- **Solution**: Implement rate limiting, use exponential backoff

**4. Empty parsing results**
- **Cause**: Poor quality scan or unsupported layout
- **Solution**: Improve file quality, manual data entry fallback

### Debug Mode
```javascript
// Enable detailed logging
process.env.DEBUG = "openai:*"
```

### Health Checks
```bash
# Test API endpoints
curl -X POST http://localhost:3001/api/enhance-bullet \
  -H "Content-Type: application/json" \
  -d '{"text": "Managed team"}'
```

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- OpenAI API usage tracking
- Resource utilization metrics

## Security Considerations

### API Security
- Input validation and sanitization
- Rate limiting per IP/user
- File type and size restrictions
- Secure file storage with expiration

### Data Privacy
- Temporary file processing
- Automatic cleanup of uploaded files
- No persistent storage of sensitive data
- GDPR compliance considerations

### OpenAI Security
- Secure API key management
- Request/response logging controls
- Data retention policies
- Usage monitoring and alerts

## Code Examples

### Frontend Integration

**File Upload Component Usage**:
```jsx
import { parseResumeFromUpload } from '../utils/ai';

const handleResumeUpload = async (fileUrl) => {
  try {
    setProcessingStep("Creating resume...");
    const parsedData = await parseResumeFromUpload(fileUrl);
    const transformedData = transformParsedDataToResumeFormat(parsedData);
    await createResume(transformedData);
    toast.success("Resume created successfully!");
  } catch (error) {
    console.error("Processing error:", error);
    toast.error("Failed to process resume. Please try again.");
  }
};
```

**Error Handling Pattern**:
```javascript
export async function parseResumeFromUpload(fileUrl) {
  try {
    const res = await fetch(`${API_BASE}/parse-resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    if (!data.success) {
      throw new Error(data.error || data.details || "Failed to parse resume");
    }

    return data.data;
  } catch (err) {
    console.error("Resume Parsing Error:", err);
    throw err;
  }
}
```

### Backend Implementation

**Express Router Setup**:
```javascript
import express from "express";
import { parseResumeFromFile, checkATSFromFile } from "../config/openai.js";

const router = express.Router();

router.post("/parse-resume", async (req, res) => {
  const { fileUrl } = req.body;

  if (!fileUrl) {
    return res.status(400).json({ error: "File URL is required" });
  }

  try {
    const parsedResume = await parseResumeFromFile(fileUrl);
    return res.json({ success: true, data: parsedResume });
  } catch (err) {
    console.error("Resume Parsing Error:", err.message);
    return res.status(500).json({
      error: "Failed to parse resume",
      details: err.message,
    });
  }
});

export default router;
```

**OpenAI Assistant Implementation**:
```javascript
export async function parseResumeFromFile(fileUrl) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    // Step 1: Download and upload file
    const fileResponse = await fetch(fileUrl);
    const fileBuffer = await fileResponse.arrayBuffer();
    const file = new File([fileBuffer], fileName, { type: contentType });

    const uploadedFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    // Step 2: Create assistant with file_search tool
    const assistant = await openai.beta.assistants.create({
      name: "Resume Parser",
      instructions: `You are an expert resume parser. ${prompt}`,
      model: "gpt-4.1-mini-2025-04-14",
      tools: [{ type: "file_search" }],
    });

    // Step 3: Create vector store
    const vectorStore = await openai.vectorStores.create({
      name: "Resume Analysis",
      file_ids: [uploadedFile.id],
    });

    // Step 4: Update assistant with vector store
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    // Step 5: Create thread and run
    const thread = await openai.beta.threads.create({
      messages: [{
        role: "user",
        content: "Please analyze the uploaded resume file and extract all information according to the JSON format specified in your instructions."
      }],
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });

    // Step 6: Get response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const responseText = messages.data[0].content[0]?.text?.value?.trim() || "";

    // Step 7: Parse JSON response
    let cleanedResponse = responseText;
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsedData = JSON.parse(cleanedResponse);

    // Step 8: Cleanup resources
    await openai.beta.assistants.delete(assistant.id);
    await openai.vectorStores.delete(vectorStore.id);
    await openai.files.delete(uploadedFile.id);

    return parsedData;
  } catch (error) {
    console.error("❌ Resume parsing error:", error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
}
```

## Database Schema

### Firebase Firestore Collections

**Users Collection** (`/users/{userId}`):
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "createdAt": "timestamp",
  "lastLogin": "timestamp",
  "subscription": {
    "plan": "free|premium",
    "expiresAt": "timestamp"
  }
}
```

**Resumes Collection** (`/resumes/{resumeId}`):
```json
{
  "userId": "string",
  "name": "string",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "websiteURL": "string"
  },
  "skills": [
    {
      "domain": "string",
      "languages": ["string"]
    }
  ],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "technologies": "string",
      "years": "string",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "github": "string",
      "demo": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "specialization": "string",
      "location": "string",
      "duration": "string",
      "gpa": "string"
    }
  ],
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "year": "string",
      "month": "string"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "template": "classic|sidebar",
  "isPublic": "boolean"
}
```

**Uploaded Files Collection** (`/uploadedFiles/{fileId}`):
```json
{
  "userId": "string",
  "fileName": "string",
  "fileSize": "number",
  "fileType": "string",
  "fileUrl": "string",
  "uploadedAt": "timestamp",
  "processed": "boolean",
  "processingResults": {
    "resumeCreated": "boolean",
    "atsAnalyzed": "boolean",
    "jobMatched": "boolean"
  }
}
```

---

**Last Updated**: January 2025
**Version**: 2.0
**Maintainer**: ResuMate Development Team
