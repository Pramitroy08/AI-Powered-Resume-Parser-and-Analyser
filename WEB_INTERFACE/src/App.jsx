import { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, ThemeProvider, View, Text } from '@aws-amplify/ui-react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { fetchAuthSession } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_u2EGN1BAl',
      userPoolClientId: 'bb6q7o8vgn00amt9lfqig3re0', 
      identityPoolId: 'ap-south-1:c47c1eef-50bd-46c5-8ca2-dbe27eb46799'
    }
  }
});

const myTheme = {
  name: 'dark-auth-theme',
  tokens: {
    components: {
      authenticator: {
        router: {
          backgroundColor: 'transparent', // Removes the white box background
          borderWidth: '0',
          boxShadow: 'none',
        },
      },
      tabs: {
        item: {
          color: '#a0aec0',
          _active: {
            color: '#00f2fe',
            borderColor: '#00f2fe',
          },
        },
      },
      fieldcontrol: {
        color: '#ffffff', // Text color inside input
        backgroundColor: 'rgb(255, 255, 255)', // Subtle light background
        borderColor: 'rgb(255, 255, 255)', // Cyan border at 50% opacity
        borderWidth: '1px',
        _focus: {
          borderColor: '#ffffff', // Bright cyan on click
          boxShadow: '0 0 8px rgb(255, 255, 255)',
        },
        _placeholder: {
          color: '#ffffff', // Darker gray for placeholder text
        },
      },
      label: {
        color: '#ffffff', // Makes "Username" and "Password" labels Cyan
        fontWeight: 'bold',
      },
    },
  },
};



const forceVisibilityStyles = `
  /* Force Username and Password labels to be bright Cyan */
  .amplify-label {
    color: #00f2fe !important;
    font-weight: 700 !important;
    text-shadow: 0px 0px 5px rgba(0, 242, 254, 0.2);
    margin-bottom: 8px !important;
    display: block !important;
  }

  /* Make the 'Sign In' and 'Create Account' tab text brighter */
  .amplify-tabs-item {
    color: #a0aec0 !important;
  }
  
  .amplify-tabs-item--active {
    color: #00f2fe !important;
    border-color: #00f2fe !important;
  }

  /* Make placeholder text slightly lighter so you can see where to type */
  .amplify-input::placeholder {
    color: rgba(255, 255, 255, 0.4) !important;
  }
`;

const LandingPage = ({ onGetStarted }) => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at top right, #2C5364, #203A43, #000000)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: '"Inter", sans-serif',
      padding: '40px 20px',
      overflowX: 'hidden'
    }}>
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(0, 242, 254, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(236, 114, 17, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

      {/* Main Content Header */}
      <div style={{ zIndex: 2, textAlign: 'center', marginBottom: '50px' }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 20px', 
          borderRadius: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(0, 242, 254, 0.3)',
          fontSize: '12px',
          letterSpacing: '2px',
          color: '#00f2fe',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          v2.5 Gemini Core Enabled
        </div>
        <h2 style={{ 
          fontSize: '5rem', 
          margin: '0', 
          lineHeight: '1',
          background: 'linear-gradient(to bottom, #fff 30%, #a0aec0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '900'
        }}>
          <span style={{ color: '#00f2fe' }}>AI RESUME </span> PARSER & ANALYSER
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#a0aec0', maxWidth: '700px', margin: '20px auto' }}>
          The professional gateway to automated document intelligence. 
          Extract skills, analyze gaps, and optimize for ATS in seconds.
        </p>
      </div>

      {/* High-Density Info Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px', 
        maxWidth: '1100px', 
        width: '100%',
        marginBottom: '60px',
        zIndex: 2
      }}>
        {/* Box 1: Performance */}
        <div style={featureBoxStyle}>
          <div style={circleIconStyle}>⚡</div>
          <h4 style={{ margin: '10px 0' }}>Real-time Analysis</h4>
          <p style={{ fontSize: '13px', color: '#718096' }}>Sub-second extraction of technical taxonomies and professional milestones.</p>
        </div>

        {/* Box 2: Secure Storage */}
        <div style={featureBoxStyle}>
          <div style={circleIconStyle}>🔒</div>
          <h4 style={{ margin: '10px 0' }}>S3 Encryption</h4>
          <p style={{ fontSize: '13px', color: '#718096' }}>Enterprise-grade document isolation using AWS Cognito Identity Pools.</p>
        </div>

        {/* Box 3: Gemini Intelligence */}
        <div style={featureBoxStyle}>
          <div style={circleIconStyle}>🧠</div>
          <h4 style={{ margin: '10px 0' }}>Gemini Pro 2.5</h4>
          <p style={{ fontSize: '13px', color: '#718096' }}>Deep contextual feedback based on current industry hiring trends.</p>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <button 
          onClick={onGetStarted}
          style={{
            padding: '20px 60px',
            fontSize: '20px',
            fontWeight: '800',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(90deg, #00f2fe, #4facfe)',
            color: '#0F2027',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(212, 235, 83, 0.5)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          LAUNCH INTERFACE
        </button>
      </div>

      {/* Dense Footer Credits */}
      <div style={{ 
        marginTop: '80px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '60px', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        paddingTop: '30px',
        width: '80%' 
      }}>
        <div style={miniStatStyle}><span style={{color:'#ffffff'}}>● STATUS:</span> <span style={{color:'#00ff00'}}> OPERATIONAL</span></div>
        <div style={miniStatStyle}><span style={{color:'#ffffff'}}>● STORAGE:</span> <span style={{color:'#00ff00'}}>ISI-PROJECT-S3</span></div>
        <div style={miniStatStyle}><span style={{color:'#ffffff'}}>● REGION:</span> <span style={{color:'#00ff00'}}>AP-SOUTH-1</span></div>
      </div>
    </div>
  );
};

// --- Custom Styles for the "Dense" Look ---
const featureBoxStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '30px',
  borderRadius: '20px',
  backdropFilter: 'blur(10px)',
  textAlign: 'left',
  transition: 'border 0.3s ease'
};

const circleIconStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'rgba(0, 242, 254, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  color: '#00f2fe',
  marginBottom: '15px'
};

const miniStatStyle = {
  fontSize: '11px',
  color: '#4b5563',
  letterSpacing: '1px',
  fontWeight: 'bold'
};


const FormattedAnalysis = ({ data }) => {
  let parsed;
  try {
    parsed = typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    return <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{data}</div>;
  }

  const sectionLabel = { color: '#ec7211', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' };

  const renderSkills = (skillsData) => {
    if (!skillsData) return "Not specified";
    if (Array.isArray(skillsData)) {
      return skillsData.map((s, i) => <div key={i} style={{ fontSize: '13px' }}>• {s}</div>);
    }
    if (typeof skillsData === 'object') {
      return Object.entries(skillsData).map(([category, list]) => (
        <div key={category} style={{ marginBottom: '5px' }}>
          <strong style={{ fontSize: '12px', textTransform: 'capitalize' }}>{category}:</strong>
          {Array.isArray(list) ? list.map((item, idx) => <span key={idx} style={{ fontSize: '12px' }}> {item}{idx < list.length - 1 ? ',' : ''}</span>) : String(list)}
        </div>
      ));
    }
    return String(skillsData);
  };

  return (
    <div style={{ fontFamily: 'inherit', color: '#2c3e50' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#1a202c' }}>
          {parsed.name || parsed.contact_info?.name || "Extracted Profile"}
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
          {parsed.contact_info?.email && `📧 ${parsed.contact_info.email}`} 
          {parsed.contact_info?.phone && ` | 📞 ${parsed.contact_info.phone}`}
        </p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <span style={sectionLabel}>Summary</span>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', textAlign: 'justify' }}>{parsed.summary || parsed.Summary}</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <span style={sectionLabel}>Technical Expertise</span>
        <div style={{ background: '#fcfcfc', padding: '10px', borderRadius: '5px' }}>
          {renderSkills(parsed.skills || parsed.Skills || parsed.tools)}
        </div>
      </div>
      <div style={{ marginTop: '25px', padding: '15px', background: '#fff9f2', borderRadius: '8px', border: '1px solid #ffe8cc' }}>
        <span style={{ ...sectionLabel, color: '#d9480f' }}>⚠️ AI Custom Analysis & Improvements</span>
        <div style={{ fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-line', color: '#444' }}>
          {parsed.feedback || parsed.analysis || parsed.improvements || "Upload a document and provide a goal to see custom feedback."}
        </div>
      </div>
    </div>
  );
};

function DocumentProcessor({ user, signOut }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedKey, setUploadedKey] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisResult(null);
      setUploadedKey(null);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const uploadToS3 = async () => {
    if (!file) return alert("Please select a file first!");
    setUploading(true);
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens.idToken.toString();
      const s3Client = new S3Client({
        region: "ap-south-1", 
        credentials: fromCognitoIdentityPool({
          identityPoolId: "ap-south-1:c47c1eef-50bd-46c5-8ca2-dbe27eb46799",
          clientConfig: { region: "ap-south-1" },
          logins: { [`cognito-idp.ap-south-1.amazonaws.com/ap-south-1_u2EGN1BAl`]: idToken }
        })
      });
      const fileKey = `resumes/${Date.now()}-${file.name}`;
      const fileBuffer = await file.arrayBuffer();
      const command = new PutObjectCommand({
        Bucket: "isi-project", 
        Key: fileKey,
        Body: fileBuffer,
        ContentType: file.type,
      });
      await s3Client.send(command);
      setUploadedKey(fileKey); 
      alert("Secure Upload Success!");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const processWithGemini = async () => {
    if (!uploadedKey) return alert("Please upload the file to S3 first!");
    setIsProcessing(true);
    try {
      let extractedText = "";
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(" ") + "\n";
        }
        extractedText = fullText;
      } else {
        extractedText = await file.text();
      }

      const LAMBDA_URL = "https://lmjof7wxqknvdu7nj33wyzcdxq0hqzun.lambda-url.ap-south-1.on.aws/";
      const response = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: extractedText,
          userGoal: customPrompt 
        })
      });

      const resultText = await response.text(); 
      setAnalysisResult(resultText);
    } catch (error) {
      setAnalysisResult("AI Error.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: '"Inter", sans-serif' }}>
      <nav style={{ background: 'rgba(35, 47, 62, 0.95)', color: 'white', padding: '0 24px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#f5c02e', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold' }}>IDEAS-ISI</div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI RESUME PARSER & ANALYSER</h3>
        </div>
        <button onClick={signOut} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>Sign Out</button>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '20px', gap: '20px' }}>
        
        {/* --- LEFT PANEL: REDESIGNED SETUP --- */}
        <div style={{ 
          flex: '0 0 320px', 
          background: 'white', 
          borderRadius: '12px', 
          padding: '24px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          overflowY: 'auto' 
        }}>
        <h4 style={{ margin: '0', fontSize: '18px' }}>
          <span style={{ color: '#ec7211', fontWeight: 'bold' }}>01.</span> Setup
        </h4>

        {/* --- PHASE 1: UPLOAD --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase' }}>
            1. Secure Document Upload
          </label>
    
        <div 
          onClick={() => document.getElementById('hiddenFileInput').click()}
          style={{ 
            border: '2px dashed #d1d5db', 
            borderRadius: '12px', 
            padding: '30px 20px', 
            textAlign: 'center', 
            backgroundColor: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#11c7ec'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#25dea7'}
        >
          <input 
            id="hiddenFileInput"
            type="file" 
            accept=".txt,application/pdf" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>
            {file ? (
              <span style={{ color: '#10b981', fontWeight: '600' }}>✅ {file.name}</span>
            ) : (
              <>Click to browse or <br/> drag resume here</>
            )}
          </p>
        </div>

        <button 
          onClick={uploadToS3} 
          disabled={uploading || !file} 
          style={{ 
            padding: '14px', 
            background: (uploading || !file) ? '#e5e7eb' : '#083d03', 
            color: (uploading || !file) ? '#9ca3af' : 'white', 
            border: 'none', 
            borderRadius: '10px', 
            cursor: (uploading || !file) ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '15px'
          }}
        >
          {uploading ? "Uploading..." : "Secure Upload"}
        </button>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #f0f0f0', margin: '5px 0' }} />

      {/* --- PHASE 2: INPUT & ANALYSIS --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase' }}>
          2. Target Goal / Improvements
        </label>
        <textarea 
          placeholder="Ex: What improvements do I need for SDE roles?" 
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          style={{ 
            width: '100%', 
            height: '100px', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #d1d5db', 
            fontSize: '14px', 
            fontFamily: 'inherit',
            resize: 'none',
            outline: 'none',
            backgroundColor: '#f9fafb',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#08616b'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />

        <button 
          onClick={processWithGemini} 
          disabled={!uploadedKey || isProcessing} 
          style={{ 
            padding: '14px', 
            background: (!uploadedKey || isProcessing) ? '#e5e7eb' : '#37061f', 
            color: (!uploadedKey || isProcessing) ? '#553a07' : 'white', 
            border: 'none', 
            borderRadius: '10px', 
            cursor: (!uploadedKey || isProcessing) ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '15px'
          }}
        >
          {isProcessing ? "✨ Analyzing..." : "AI Analysis"}
        </button>
      </div>
    </div>

        {/* --- MIDDLE PANEL --- */}
        <div style={{ flex: 2, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 20px 0' }}><span style={{ color: '#ec7211', fontWeight: 'bold' }}>02.</span> Live Preview</h4>
          <div style={{ flex: 1, background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
            {previewUrl ? (file.type === "application/pdf" ? <iframe src={previewUrl} width="100%" height="100%" style={{ border: 'none' }} /> : <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />) : <p style={{ textAlign: 'center', paddingTop: '50px' }}>Waiting for document...</p>}
          </div>
        </div>

        {/* --- RIGHT PANEL --- */}
        <div style={{ flex: 1.5, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: '4px solid #1D8102', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 20px 0' }}><span style={{ color: '#ec7211', fontWeight: 'bold' }}>03.</span> Gemini Insights</h4>
          {analysisResult ? <FormattedAnalysis data={analysisResult} /> : <p style={{ color: '#aaa' }}>{isProcessing ? "Processing..." : "Results will appear here"}</p>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true);

  // 1. Landing Page Logic
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // 2. Authentication Logic
  return (
    <ThemeProvider theme={myTheme}>
      <style>{forceVisibilityStyles}</style>
      <div style={{ 
        minHeight: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }}>
        
        {/* Container for Authenticator + Navigation */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '20px', // Space between login box and the back button
          width: '100%',
          maxWidth: '400px' 
        }}>
          
          <Authenticator 
            initialState="signIn"
            components={{
              Header() {
                return (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <h2 style={{ color: '#ffffff', margin: 0, fontWeight: '800' }}>Client Login</h2>
                    <h4 style={{ color: '#a0aec0', fontSize: '14px', marginTop: '5px' }}>Welcome!</h4>
                  </div>
                );
              },
            }}
          >
            {({ signOut, user }) => {
              if (user) {
                return (
                  <div style={{ 
                    width: '100vw', 
                    height: '100vh', 
                    backgroundColor: 'transparent',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 2000,
                    display: 'block'
                  }}>
                    <DocumentProcessor user={user} signOut={signOut} />
                  </div>
                );
              }
              return null;
            }}
          </Authenticator>

          {/* --- THE BACK TO HOME BUTTON --- */}
          <button 
            onClick={() => setShowLanding(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgb(255, 255, 255)',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(241, 242, 242, 1)';
            }}
          >
            <b>← Back to Home</b>
          </button>

        </div>
      </div>
    </ThemeProvider>
  );
}