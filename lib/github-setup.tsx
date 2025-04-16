"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Copy, Github } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GithubSetup() {
  const [copied, setCopied] = useState(false)

  const commands = `
# Clone the repository
git clone https://github.com/Cosmo697/socalnightchurch.com.git

# Navigate to the project directory
cd socalnightchurch.com

# Install dependencies
npm install

# Start the development server
npm run dev
  `.trim()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(commands)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center glow-text">GitHub Setup Guide</h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Follow these steps to set up your GitHub repository for the Night Church website
      </p>

      <div className="grid gap-8 max-w-3xl mx-auto">
        <Card className="bg-black/50 border border-purple-900/50">
          <CardHeader>
            <CardTitle>1. Create a GitHub Repository</CardTitle>
            <CardDescription>First, you'll need to create a new repository on GitHub</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-4">
              <li className="text-muted-foreground">
                Go to{" "}
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline"
                >
                  github.com/new
                </a>
              </li>
              <li className="text-muted-foreground">Enter "socalnightchurch.com" as the repository name</li>
              <li className="text-muted-foreground">
                Add a description (optional): "Website for Night Church desert rave collective"
              </li>
              <li className="text-muted-foreground">Choose "Public" visibility (or Private if you prefer)</li>
              <li className="text-muted-foreground">Check "Add a README file"</li>
              <li className="text-muted-foreground">Click "Create repository"</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border border-purple-900/50">
          <CardHeader>
            <CardTitle>2. Clone and Set Up the Project</CardTitle>
            <CardDescription>Next, you'll need to clone the repository and set up the project locally</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-md p-4 relative">
              <pre className="text-sm text-gray-300 overflow-x-auto">{commands}</pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-white"
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy code</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border border-purple-900/50">
          <CardHeader>
            <CardTitle>3. Deploy to Vercel</CardTitle>
            <CardDescription>Finally, you can deploy your website to Vercel for hosting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-4">
              <li className="text-muted-foreground">
                Go to{" "}
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:underline"
                >
                  vercel.com/new
                </a>
              </li>
              <li className="text-muted-foreground">Import your GitHub repository (socalnightchurch.com)</li>
              <li className="text-muted-foreground">Configure your project settings (the defaults should work fine)</li>
              <li className="text-muted-foreground">Click "Deploy"</li>
              <li className="text-muted-foreground">
                Once deployed, you can set up your custom domain (socalnightchurch.com) in the Vercel dashboard
              </li>
            </ol>
          </CardContent>
        </Card>

        <Alert className="bg-black/70 border-yellow-600">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            Make sure to keep your repository up to date by regularly committing and pushing changes:
            <pre className="mt-2 bg-black/50 p-2 rounded-md text-sm">
              git add .<br />
              git commit -m "Your update message"
              <br />
              git push
            </pre>
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button asChild size="lg" className="bg-[#24292e] hover:bg-[#1b1f23]">
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              Create GitHub Repository
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
