/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vh2yXBd1kuU
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <Link className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4" href="#">
          <FrameIcon className="w-6 h-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Projects
          </Link>
          <Link className="font-bold" href="#">
            Schemes
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Analytics
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Settings
          </Link>
        </nav>
        <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Button className="rounded-full ml-auto" size="icon" variant="ghost">
            <BellIcon className="w-4 h-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <Button className="rounded-full" size="icon" variant="ghost">
            <img
              alt="Avatar"
              className="rounded-full border"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col p-4 md:p-10">
        <div className="flex items-center gap-4 md:gap-8">
          <form className="flex-1 grid gap-2">
            <Input className="bg-white dark:bg-gray-950" placeholder="Search schemes..." />
            <Button className="w-8 h-8" size="icon">
              <SearchIcon className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <Button size="sm">Sort by Votes</Button>
        </div>
        <div className="flex flex-col gap-4 md:gap-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <ActivityIcon className="w-8 h-8" />
              <div className="grid gap-1">
                <CardTitle>Monthly Bonus</CardTitle>
                <CardDescription>Employees will receive a monthly bonus based on their performance.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="grid grid-cols-2 items-center">
                <div className="text-2xl font-bold">120</div>
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span className="text-gray-500 dark:text-gray-400">60%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="text-2xl font-bold">80</div>
                <div className="flex items-center gap-1">
                  <TrendingDownIcon className="w-4 h-4" />
                  <span className="text-gray-500 dark:text-gray-400">40%</span>
                </div>
              </div>
              <Button size="sm">Agree</Button>
              <Button size="sm">Disagree</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <ActivityIcon className="w-8 h-8" />
              <div className="grid gap-1">
                <CardTitle>Flexible Work Hours</CardTitle>
                <CardDescription>Employees can choose their work hours based on their preference.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="grid grid-cols-2 items-center">
                <div className="text-2xl font-bold">100</div>
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span className="text-gray-500 dark:text-gray-400">50%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="text-2xl font-bold">100</div>
                <div className="flex items-center gap-1">
                  <TrendingDownIcon className="w-4 h-4" />
                  <span className="text-gray-500 dark:text-gray-400">50%</span>
                </div>
              </div>
              <Button size="sm">Agree</Button>
              <Button size="sm">Disagree</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <ActivityIcon className="w-8 h-8" />
              <div className="grid gap-1">
                <CardTitle>Team Building Activities</CardTitle>
                <CardDescription>Company-sponsored team building activities to improve collaboration.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="grid grid-cols-2 items-center">
                <div className="text-2xl font-bold">80</div>
                <div className="flex items-center gap-1">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span className="text-gray-500 dark:text-gray-400">40%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="text-2xl font-bold">120</div>
                <div className="flex items-center gap-1">
                  <TrendingDownIcon className="w-4 h-4" />
                  <span className="text-gray-500 dark:text-gray-400">60%</span>
                </div>
              </div>
              <Button size="sm">Agree</Button>
              <Button size="sm">Disagree</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}


function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}


function FrameIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function TrendingDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  )
}


function TrendingUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
