import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">
          Last updated: December 29, 2025
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Our Commitment to Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              At Macedonia Explorer, we take your privacy seriously. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our interactive map
              application. Please read this privacy policy carefully. If you do
              not agree with the terms of this privacy policy, please do not
              access the application.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We collect information that you voluntarily provide when
                creating an account:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>Email address</li>
                <li>Name (if provided)</li>
                <li>Authentication credentials</li>
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We automatically collect certain information about your
                interaction with our application:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>Regions you&apos;ve marked as visited</li>
                <li>Date and time of visits</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
              <li>To create and manage your user account</li>
              <li>
                To save and synchronize your visited regions across devices
              </li>
              <li>To provide personalized features and track your progress</li>
              <li>To improve our application and user experience</li>
              <li>To communicate with you about updates and support</li>
              <li>To ensure security and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We implement appropriate technical and organizational security
              measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
              <li>All data transmission is encrypted using HTTPS/SSL</li>
              <li>Passwords are hashed using industry-standard algorithms</li>
              <li>Database is hosted on secure, SOC 2 compliant servers</li>
              <li>Regular security audits and updates</li>
              <li>
                Access to personal data is restricted to authorized personnel
                only
              </li>
            </ul>
            <Separator />
            <p className="text-sm text-muted-foreground">
              However, no method of transmission over the Internet or electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your personal information, we cannot
              guarantee its absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              You have certain rights regarding your personal information:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-sm mb-1">Right to Access</h3>
                <p className="text-sm text-muted-foreground">
                  You can request a copy of the personal data we hold about you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Right to Correction
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can update or correct your personal information at any
                  time through your profile settings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Right to Deletion
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can request deletion of your account and all associated
                  data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Right to Data Portability
                </h3>
                <p className="text-sm text-muted-foreground">
                  You can request your data in a structured, machine-readable
                  format.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We use the following third-party services to operate our
              application:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-4">
              <li>
                <strong>Neon Database:</strong> For secure data storage
                (PostgreSQL)
              </li>
              <li>
                <strong>NextAuth:</strong> For authentication services
              </li>
              <li>
                <strong>amCharts:</strong> For interactive map visualization
              </li>
              <li>
                <strong>Vercel:</strong> For hosting and deployment
              </li>
            </ul>
            <Separator />
            <p className="text-sm text-muted-foreground">
              These third-party service providers have their own privacy
              policies addressing how they use such information. We encourage
              you to review their privacy policies.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We use cookies and similar tracking technologies to track activity
              on our application and store certain information. Cookies are
              files with a small amount of data which may include an anonymous
              unique identifier.
            </p>
            <Separator />
            <div>
              <h3 className="font-semibold text-sm mb-2">
                Types of Cookies We Use:
              </h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for
                  authentication and core functionality
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how you
                  use our application
                </li>
              </ul>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">
              You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent. However, if you do not accept
              cookies, you may not be able to use some portions of our
              application.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children&rsquo;s Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our application is suitable for all ages, including children. We
              do not knowingly collect personally identifiable information from
              children under 13 without parental consent. If you are a parent or
              guardian and you are aware that your child has provided us with
              personal information, please contact us so that we can take
              necessary actions.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;Last updated&quot; date at the top of this
              Privacy Policy.
            </p>
            <p className="text-sm text-muted-foreground">
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they
              are posted on this page.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:privacy@macedoniaexplorer.com"
                  className="text-primary hover:underline"
                >
                  privacy@macedoniaexplorer.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <Link href="/" className="text-primary hover:underline">
                  macedoniaexplorer.com
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
