/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GN4yKqdznfE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"

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
            Logs
          </Link>
          <Link className="text-gray-500 dark:text-gray-400" href="#">
            Settings
          </Link>
        </nav>
        <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Button className="rounded-full ml-auto" size="icon" variant="ghost">
            <SearchIcon className="w-4 h-4" />
            <span className="sr-only">Toggle search</span>
          </Button>
          <Button className="rounded-full" size="icon" variant="ghost">
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
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-4 md:gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Scheme Voting</h1>
              <p className="text-gray-500 dark:text-gray-400">Vote for your favorite schemes. Your vote matters!</p>
            </div>
            <div className="grid gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <TrendingUpIcon className="w-8 h-8" />
                  <div className="grid gap-1">
                    <CardTitle>Green Energy</CardTitle>
                    <CardDescription>Invest in renewable energy sources.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          className="w-4 h-4 border-gray-300 rounded-md text-gray-700 dark:border-gray-700 dark:text-gray-300 focus:[outline-none
                          ring-2] appearance-none
                        "
                          id="agree"
                          name="vote"
                          type="radio"
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="agree">
                          Agree
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          className="w-4 h-4 border-gray-300 rounded-md text-gray-700 dark:border-gray-700 dark:text-gray-300 focus:[outline-none
                          ring-2] appearance-none
                        "
                          id="disagree"
                          name="vote"
                          type="radio"
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="disagree">
                          Disagree
                        </label>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button variant="ghost">View Results</Button>
                  <Button>Vote</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <TrendingUpIcon className="w-8 h-8" />
                  <div className="grid gap-1">
                    <CardTitle>Free Healthcare</CardTitle>
                    <CardDescription>Universal access to medical care.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          className="w-4 h-4 border-gray-300 rounded-md text-gray-700 dark:border-gray-700 dark:text-gray-300 focus:[outline-none
                          ring-2] appearance-none
                        "
                          id="agree-2"
                          name="vote"
                          type="radio"
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="agree-2">
                          Agree
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          className="w-4 h-4 border-gray-300 rounded-md text-gray-700 dark:border-gray-700 dark:text-gray-300 focus:[outline-none
                          ring-2] appearance-none
                        "
                          id="disagree-2"
                          name="vote"
                          type="radio"
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="disagree-2">
                          Disagree
                        </label>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button variant="ghost">View Results</Button>
                  <Button>Vote</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <TrendingUpIcon className="w-8 h-8" />
                  <div className="grid gap-1">
                    <CardTitle>Basic Income</CardTitle>
                    <CardDescription>Guaranteed income for all citizens.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          className="w-4 h-4 border-gray-300 rounded-md text-gray-700 dark:border-gray-700 dark:text-gray-300 focus:[outline-none
                          ring-2] appearance-none
                        "
                          id="agree-3"
                          name="vote"
                          type="radio"
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="agree-3">
                          Agree
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          className="w-4 h-4 border-gray-300 rounded-md text-gray-700 dark:border-gray-700 dark:text-gray-300 focus:[outline-none
                          ring-2] appearance-none
                        "
                          id="disagree-3"
                          name="vote"
                          type="radio"
                        />
                        <label className="text-sm font-medium cursor-pointer" htmlFor="disagree-3">
                          Disagree
                        </label>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <Button variant="ghost">View Results</Button>
                  <Button>Vote</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
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
