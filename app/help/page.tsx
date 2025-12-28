import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
        <p className="text-xl text-muted-foreground">
          Get answers to common questions and learn how to use Macedonia
          Explorer
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                How do I create an account?
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the &ldquo;Login&rdquo; button in the navigation bar. You
                can sign up using your email address or other authentication
                providers. Your account allows you to save your progress and
                access it from any device.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">
                How do I mark a region as visited?
              </h3>
              <p className="text-sm text-muted-foreground">
                Simply click on any region on the interactive map. The region
                will be marked with a Macedonian flag pattern. Click again to
                unmark it. Your progress is automatically saved if you&rsquo;re
                logged in.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">
                How do I view region details?
              </h3>
              <p className="text-sm text-muted-foreground">
                Hover over any region on the map to see a quick preview with
                basic information. For more detailed information, click on the
                region name in the hover card or navigate to the Regions page.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Features & Functionality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                What information is shown for each region?
              </h3>
              <p className="text-sm text-muted-foreground">
                Each region displays its name, population, a brief description,
                beautiful imagery, and top places to visit. The map hover shows
                a short summary, while the dedicated region pages provide more
                comprehensive information.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">
                How does progress tracking work?
              </h3>
              <p className="text-sm text-muted-foreground">
                Your progress is tracked in real-time as you mark regions. The
                statistics card on the home page shows your total visited
                regions, percentage completion, and total population coverage.
                All progress is automatically saved to your account.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Can I share my progress?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Click the &ldquo;Share Map&rdquo; button on the home page.
                If your device supports native sharing, you can share via apps.
                Otherwise, the link will be copied to your clipboard for easy
                sharing.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">
                Is my data saved automatically?
              </h3>
              <p className="text-sm text-muted-foreground">
                If you&rsquo;re logged in, your visited regions are
                automatically saved to the database. You can access your
                progress from any device by logging into your account.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Technical Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                The map isn&rsquo;t loading. What should I do?
              </h3>
              <p className="text-sm text-muted-foreground">
                Try refreshing the page. If the issue persists, clear your
                browser cache and cookies. The map requires JavaScript to be
                enabled. Make sure your browser is up to date.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">
                My progress isn&rsquo;t saving. Why?
              </h3>
              <p className="text-sm text-muted-foreground">
                Make sure you&rsquo;re logged into your account. Progress is
                only saved for authenticated users. Check your internet
                connection, as saving requires an active connection to our
                servers.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">
                Is the site mobile-friendly?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes! Macedonia Explorer is fully responsive and works on all
                devices including smartphones and tablets. The map and all
                features are optimized for touch interactions.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">
                Which browsers are supported?
              </h3>
              <p className="text-sm text-muted-foreground">
                We support all modern browsers including Chrome, Firefox,
                Safari, and Edge. For the best experience, keep your browser
                updated to the latest version.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Account & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">What data do you collect?</h3>
              <p className="text-sm text-muted-foreground">
                We only collect essential information: your email for
                authentication and the regions you&rsquo;ve marked as visited.
                We do not share your data with third parties. See our Privacy
                Policy for full details.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Can I delete my account?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can request account deletion by contacting us. All your
                data including visited regions will be permanently removed from
                our database.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-sm text-muted-foreground">
                Yes. We use industry-standard security practices including
                encrypted connections (HTTPS), secure authentication, and
                protected database storage. Your passwords are hashed and never
                stored in plain text.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Still Need Help?
            </CardTitle>
            <CardDescription>
              Can&apos;t find the answer you&apos;re looking for?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have additional questions or need further assistance,
              please don&rsquo;t hesitate to reach out. We&rsquo;re here to help
              you make the most of your Macedonia exploration experience.
            </p>
            <p className="text-sm">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:support@macedoniaexplorer.com"
                className="text-primary hover:underline"
              >
                support@macedoniaexplorer.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
