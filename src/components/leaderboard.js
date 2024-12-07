import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

const LeaderboardTable = () => {
  // Generate sample data
  const generateSampleData = () => {
    const usernames = ["Player1", "GameMaster", "TweetPro", "SocialGuru"];
    const sampleData = usernames.map((username) => {
      const totalTweets = Math.floor(Math.random() * 1000) + 100;
      const hintRequests = Math.floor(Math.random() * (totalTweets / 2));
      const score = Math.floor(Math.random() * 10000) + 1000;

      return {
        username,
        score,
        totalTweets,
        hintRequests,
        lastUpdated: Date.now() - Math.floor(Math.random() * 86400000),
        stats: {
          hintRequestPercentage: Math.round((hintRequests / totalTweets) * 100),
          averageScore: Math.round(score / totalTweets),
        },
      };
    });

    return {
      timestamp: Date.now(),
      totalUsers: usernames.length,
      leaderboard: sampleData,
    };
  };

  const [sortConfig, setSortConfig] = React.useState({
    key: "score",
    direction: "desc",
  });

  // Initialize with sample data
  const [data, setData] = React.useState(() => generateSampleData());

  // Separate state for client-side rendered content
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const sortData = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "desc"
          ? "asc"
          : "desc",
    });
  };

  // Format date with fallback for server-side rendering
  const formatDate = (timestamp) => {
    if (!isClient) return "..."; // Show placeholder during SSR
    return new Date(timestamp).toLocaleString();
  };

  const sortedData = React.useMemo(() => {
    return [...data.leaderboard].sort((a, b) => {
      if (sortConfig.key.includes(".")) {
        const [parent, child] = sortConfig.key.split(".");
        if (sortConfig.direction === "desc") {
          return b[parent][child] - a[parent][child];
        }
        return a[parent][child] - b[parent][child];
      }

      if (sortConfig.direction === "desc") {
        return b[sortConfig.key] - a[sortConfig.key];
      }
      return a[sortConfig.key] - b[sortConfig.key];
    });
  }, [data.leaderboard, sortConfig]);

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => sortData("score")}
              >
                Score <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => sortData("totalTweets")}
              >
                Total Tweets <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => sortData("hintRequests")}
              >
                Hints Used <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => sortData("stats.hintRequestPercentage")}
              >
                Hint % <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => sortData("stats.averageScore")}
              >
                Avg Score <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((user, index) => (
              <TableRow key={user.username} className="hover:bg-white">
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.score.toLocaleString()}</TableCell>
                <TableCell>{user.totalTweets.toLocaleString()}</TableCell>
                <TableCell>{user.hintRequests.toLocaleString()}</TableCell>
                <TableCell>{user.stats.hintRequestPercentage}%</TableCell>
                <TableCell>
                  {user.stats.averageScore.toLocaleString()}
                </TableCell>
                <TableCell suppressHydrationWarning>
                  {formatDate(user.lastUpdated)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-full flex justify-end mt-6 font-bold">
          <span className="text-sm font-mono" suppressHydrationWarning>
            Total Users: {data.totalUsers} | Last Updated:{" "}
            {formatDate(data.timestamp)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
