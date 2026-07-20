import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart';
import 'package:syncfusion_flutter_pdf/pdf.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'dart:typed_data';
import 'dart:convert';

void main() => runApp(const ResumeAIApp());

class ResumeAIApp extends StatelessWidget {
  const ResumeAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme),
      ),
      home: const IndexPage(),
    );
  }
}

// --- SCREEN 1: BEAUTIFUL INDEX ---
class IndexPage extends StatelessWidget {
  const IndexPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0F2027), Color(0xFF2C5364)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.bolt, size: 100, color: Colors.cyanAccent),
            Text(
              "AI Resume",
              style: GoogleFonts.bebasNeue(fontSize: 60, color: Colors.cyanAccent),
            ),
            const Text(
              "Analyze. Optimize. Succeed.",
              style: TextStyle(letterSpacing: 2),
            ),
            const SizedBox(height: 100),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.cyanAccent,
                padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const LoginPage()),
              ),
              child: const Text(
                "GET STARTED",
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// --- SCREEN 2: LOGIN ---
class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: Padding(
        padding: const EdgeInsets.all(30.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Login",
              style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 40),
            TextField(
              decoration: InputDecoration(
                labelText: "Email",
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: "Password",
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const DashboardPage()),
                ),
                child: const Text("LOGIN"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// --- SCREEN 3: DASHBOARD ---
class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final TextEditingController _queryController = TextEditingController();

  // THE API LOGIC
  Future<String> _getAIResponse(String resumeText, String query) async {
    // 1. Setup your API Key
    const apiKey = 'AIzaSyClahOeoR5FAbTmdFDQzBZxj7mS-c9Aq9I'; // <--- REPLACE THIS
    
    final model = GenerativeModel(
      model: 'gemini-2.5-flash',
      apiKey: apiKey,
    );

    // 2. Craft the prompt
    final prompt = '''
      You are a professional technical recruiter and career coach.
      
      User Query: "$query"
      
      Resume Data Extracted:
      ---
      $resumeText
      ---
      
      Instructions:
      1. Analyze the resume specifically for the goals mentioned in the user query.
      2. Identify and visit/mention any websites, GitHub profiles, or Portfolios found in the text.
      3. Provide 3-5 high-impact bullet points for improvement.
      4. Use a encouraging but professional tone.
    ''';

    final content = [Content.text(prompt)];
    final response = await model.generateContent(content);
    
    return response.text ?? "AI was unable to generate a response. Please try again.";
  }

  Future<void> _handleUpload(BuildContext context) async {
    if (_queryController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter a query first!")),
      );
      return;
    }

    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
      withData: true,
    );

    if (result != null && result.files.first.bytes != null) {
      String fileName = result.files.first.name;
      String userQuery = _queryController.text;

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(color: Colors.cyanAccent),
        ),
      );

      try {
        // 1. Extract text from PDF using Syncfusion
        final PdfDocument document = PdfDocument(inputBytes: result.files.first.bytes);
        String extractedText = PdfTextExtractor(document).extractText();
        document.dispose();

        // 2. Get Real AI response from Gemini
        String aiFeedback = await _getAIResponse(extractedText, userQuery);

        if (context.mounted) {
          Navigator.pop(context); // Close loading dialog
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => AnalysisResultPage(
                fileName: fileName,
                userQuery: userQuery,
                aiFeedback: aiFeedback,
              ),
            ),
          );
        }
      } catch (e) {
        if (context.mounted) Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error: $e")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Resume AI")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("1. What do you want to ask AI?", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            TextField(
              controller: _queryController,
              decoration: InputDecoration(
                hintText: "e.g., How can I improve for an SDE role?",
                filled: true,
                fillColor: Colors.white10,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(15)),
              ),
            ),
            const SizedBox(height: 30),
            const Text("2. Upload your Resume", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            _actionCard(
              context,
              "Upload & Analyze",
              Icons.upload_file,
              Colors.cyanAccent,
              () => _handleUpload(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _actionCard(BuildContext context, String title, IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 120,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white10,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.5)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(width: 15),
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

// --- SCREEN 4: ANALYSIS RESULTS ---
class AnalysisResultPage extends StatelessWidget {
  final String fileName;
  final String userQuery;
  final String aiFeedback;

  const AnalysisResultPage({
    super.key,
    required this.fileName,
    required this.userQuery,
    required this.aiFeedback,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AI Feedback")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("QUERY: $userQuery", 
              style: const TextStyle(color: Colors.cyanAccent, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text("File: $fileName", style: const TextStyle(color: Colors.white54, fontSize: 12)),
            const SizedBox(height: 20),
            const Text("AI SUGGESTIONS:", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const Divider(color: Colors.white24),
            
            // This now displays the ACTUAL Gemini response
            Text(
              aiFeedback,
              style: const TextStyle(fontSize: 15, height: 1.6),
            ),
            
            const SizedBox(height: 40),
            Center(
              child: ElevatedButton.icon(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.arrow_back),
                label: const Text("Analyze Another"),
              ),
            )
          ],
        ),
      ),
    );
  }
}