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
  // Generate consistent sample data with lower values
  const generateSampleData = () => {
    const usernames = ["Player1", "GameMaster", "TweetPro"];
    // Fixed seed values to ensure consistency across refreshes
    const sampleData = [
      {
        username: "devswayam",
        score: 4.04,
        totalTweets: 375,
        hintRequests: 5,
        lastUpdated: Date.now() - 36000000,
        stats: {
          hintRequestPercentage: 5.44,
          averageScore: 4.47,
        },
      },
      {
        username: "vwakesahu",
        score: 5.46,
        totalTweets: 320,
        hintRequests: 15,
        lastUpdated: Date.now() - 46000000,
        stats: {
          hintRequestPercentage: 5.46,
          averageScore: 5.46,
        },
      },
      {
        username: "shanksethd77956",
        score: 5.45,
        totalTweets: 280,
        hintRequests: 12,
        lastUpdated: Date.now() - 56000000,
        stats: {
          hintRequestPercentage: 5.45,
          averageScore: 5.45,
        },
      },
    ];

    return sampleData;
  };

  const [sortConfig, setSortConfig] = React.useState({
    key: "score",
    direction: "desc",
  });

  const [apiData, setApiData] = React.useState(null);
  const [dummyData] = React.useState(generateSampleData);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://hxxgxmdd-8000.inc1.devtunnels.ms/leaderboard");
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchData();
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

  const formatDate = (timestamp) => {
    if (!isClient) return "...";
    return new Date(timestamp).toLocaleString();
  };

  const combinedAndSortedData = React.useMemo(() => {
    let serverData = apiData?.leaderboard || [];
    let combined = [...serverData, ...dummyData];

    return combined.sort((a, b) => {
      // First prioritize real data vs dummy data
      const aIsReal = serverData.some((item) => item.username === a.username);
      const bIsReal = serverData.some((item) => item.username === b.username);

      if (aIsReal && !bIsReal) return -1;
      if (!aIsReal && bIsReal) return 1;

      // Then apply the regular sorting
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
  }, [apiData, dummyData, sortConfig]);

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
            {combinedAndSortedData.map((user, index) => (
              <TableRow
                key={user.username}
                className={`hover:bg-white ${
                  apiData?.leaderboard?.some(
                    (item) => item.username === user.username
                  )
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">@{user.username}</TableCell>
                <TableCell>
                  {typeof user.score === "number"
                    ? user.score.toLocaleString()
                    : user.score}
                </TableCell>
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
            Total Users: {apiData?.totalUsers || 0} | Last Updated:{" "}
            {apiData ? formatDate(apiData.timestamp) : "..."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
