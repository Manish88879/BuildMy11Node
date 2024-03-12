const User = require("./../user/user_model");
const MatchList = require("./../match/match_list_model");
const Contest = require("./contest_model");
const joincontests = require("./../join_contest/join_contest_model");
const team1 = require("./../team/team_model");

const globalNumberOfWinnerList = [
  1, 2, 3, 4, 5, 7, 10, 15, 25, 50, 100, 250, 500, 1000, 2000, 5000,
];

const prizeDivisionList = [
  [{ Winner: 1, prizePoolPercentage: 100 }],
  [
    { Winner: 1, prizePoolPercentage: 70 },
    { Winner: 2, prizePoolPercentage: 30 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 50 },
    { Winner: 2, prizePoolPercentage: 30 },
    { Winner: 3, prizePoolPercentage: 20 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 40 },
    { Winner: 2, prizePoolPercentage: 25 },
    { Winner: 3, prizePoolPercentage: 20 },
    { Winner: 4, prizePoolPercentage: 15 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 40 },
    { Winner: 2, prizePoolPercentage: 23 },
    { Winner: 3, prizePoolPercentage: 15 },
    { Winner: "4 - 5", prizePoolPercentage: 11 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 35 },
    { Winner: 2, prizePoolPercentage: 19 },
    { Winner: 3, prizePoolPercentage: 12 },
    { Winner: 4, prizePoolPercentage: 10 },
    { Winner: "5-7", prizePoolPercentage: 8 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 30 },
    { Winner: 2, prizePoolPercentage: 18 },
    { Winner: 3, prizePoolPercentage: 11 },
    { Winner: 4, prizePoolPercentage: 7.5 },
    { Winner: 5, prizePoolPercentage: 6 },
    { Winner: "6 - 10", prizePoolPercentage: 5.5 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 25 },
    { Winner: 2, prizePoolPercentage: 12.5 },
    { Winner: 3, prizePoolPercentage: 10 },
    { Winner: 4, prizePoolPercentage: 7.5 },
    { Winner: 5, prizePoolPercentage: 5 },
    { Winner: "6 - 15", prizePoolPercentage: 4 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 20 },
    { Winner: 2, prizePoolPercentage: 12 },
    { Winner: 3, prizePoolPercentage: 8 },
    { Winner: 4, prizePoolPercentage: 5 },
    { Winner: 5, prizePoolPercentage: 5 },
    { Winner: "6 - 25", prizePoolPercentage: 2.5 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 15 },
    { Winner: 2, prizePoolPercentage: 10 },
    { Winner: 3, prizePoolPercentage: 8 },
    { Winner: 4, prizePoolPercentage: 4 },
    { Winner: 5, prizePoolPercentage: 3 },
    { Winner: "6 - 10", prizePoolPercentage: 2 },
    { Winner: "11 - 25", prizePoolPercentage: 1.5 },
    { Winner: "26 - 50", prizePoolPercentage: 1.1 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 15 },
    { Winner: 2, prizePoolPercentage: 10 },
    { Winner: 3, prizePoolPercentage: 8 },
    { Winner: 4, prizePoolPercentage: 3.75 },
    { Winner: 5, prizePoolPercentage: 3.5 },
    { Winner: "6 - 10", prizePoolPercentage: 1.5 },
    { Winner: "11 - 15", prizePoolPercentage: 1 },
    { Winner: "16 - 25", prizePoolPercentage: 0.6 },
    { Winner: "26 - 100", prizePoolPercentage: 0.55 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 12 },
    { Winner: 2, prizePoolPercentage: 7.5 },
    { Winner: 3, prizePoolPercentage: 5 },
    { Winner: 4, prizePoolPercentage: 3 },
    { Winner: 5, prizePoolPercentage: 2.25 },
    { Winner: "6 - 10", prizePoolPercentage: 2 },
    { Winner: "11 - 15", prizePoolPercentage: 1 },
    { Winner: "16 - 25", prizePoolPercentage: 0.5 },
    { Winner: "26 - 50", prizePoolPercentage: 0.25 },
    { Winner: "51 - 250", prizePoolPercentage: 0.22 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 10 },
    { Winner: 2, prizePoolPercentage: 7 },
    { Winner: 3, prizePoolPercentage: 3.5 },
    { Winner: "4 - 5", prizePoolPercentage: 2.5 },
    { Winner: "6 - 10", prizePoolPercentage: 1 },
    { Winner: "11 - 25", prizePoolPercentage: 0.3 },
    { Winner: "26 - 100", prizePoolPercentage: 0.2 },
    { Winner: "101 - 250", prizePoolPercentage: 0.15 },
    { Winner: "251 - 500", prizePoolPercentage: 0.11 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 5 },
    { Winner: 2, prizePoolPercentage: 3 },
    { Winner: 3, prizePoolPercentage: 1.7 },
    { Winner: "4 - 10", prizePoolPercentage: 0.9 },
    { Winner: "11 - 50", prizePoolPercentage: 0.3 },
    { Winner: "51 - 100", prizePoolPercentage: 0.2 },
    { Winner: "101 - 500", prizePoolPercentage: 0.08 },
    { Winner: "501 - 1000", prizePoolPercentage: 0.06 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 5 },
    { Winner: 2, prizePoolPercentage: 3 },
    { Winner: 3, prizePoolPercentage: 2 },
    { Winner: "4 - 10", prizePoolPercentage: 1 },
    { Winner: "11 - 50", prizePoolPercentage: 0.2 },
    { Winner: "51 - 100", prizePoolPercentage: 0.1 },
    { Winner: "101 - 500", prizePoolPercentage: 0.05 },
    { Winner: "501 - 1000", prizePoolPercentage: 0.04 },
    { Winner: "1001 - 2000", prizePoolPercentage: 0.03 },
  ],
  [
    { Winner: 1, prizePoolPercentage: 4 },
    { Winner: 2, prizePoolPercentage: 2 },
    { Winner: 3, prizePoolPercentage: 1 },
    { Winner: "4 - 10", prizePoolPercentage: 0.5 },
    { Winner: "11 - 50", prizePoolPercentage: 0.25 },
    { Winner: "51 - 100", prizePoolPercentage: 0.1 },
    { Winner: "101 - 500", prizePoolPercentage: 0.05 },
    { Winner: "501 - 1000", prizePoolPercentage: 0.021 },
    { Winner: "1001 - 5000", prizePoolPercentage: 0.011 },
  ],
];

// getting prize pool table
const prizePoolTable = async (req, res) => {
  try {
    let { match_id, contest_name, contest_size, entry_fee } = req.body;
    let maxPrizePool =
      contest_size * entry_fee - contest_size * entry_fee * 0.1;

    // const globalNumberOfWinnerList = [
    //   1, 2, 3, 4, 5, 7, 10, 15, 25, 50, 100, 250, 500, 1000, 2000, 5000,
    // ];
    //apply Math.round() of price
    const prizeDivisionList = [
      [
        {
          Winner: 1,
          prizePoolPercentage: 100,
          price: Math.round(maxPrizePool * 1),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 70,
          price: Math.round(maxPrizePool * 0.7),
        },
        {
          Winner: 2,
          prizePoolPercentage: 30,
          price: Math.round(maxPrizePool * 0.3),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 50,
          price: Math.round(maxPrizePool * 0.5),
        },
        {
          Winner: 2,
          prizePoolPercentage: 30,
          price: Math.round(maxPrizePool * 0.3),
        },
        {
          Winner: 3,
          prizePoolPercentage: 20,
          price: Math.round(maxPrizePool * 0.2),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 40,
          price: Math.round(maxPrizePool * 0.4),
        },
        {
          Winner: 2,
          prizePoolPercentage: 25,
          price: Math.round(maxPrizePool * 0.25),
        },
        {
          Winner: 3,
          prizePoolPercentage: 20,
          price: Math.round(maxPrizePool * 0.2),
        },
        {
          Winner: 4,
          prizePoolPercentage: 15,
          price: Math.round(maxPrizePool * 0.15),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 40,
          price: Math.round(maxPrizePool * 0.4),
        },
        {
          Winner: 2,
          prizePoolPercentage: 23,
          price: Math.round(maxPrizePool * 0.23),
        },
        {
          Winner: 3,
          prizePoolPercentage: 15,
          price: Math.round(maxPrizePool * 0.15),
        },
        {
          Winner: "4 - 5",
          prizePoolPercentage: 11,
          price: Math.round(maxPrizePool * 0.11),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 35,
          price: Math.round(maxPrizePool * 0.35),
        },
        {
          Winner: 2,
          prizePoolPercentage: 19,
          price: Math.round(maxPrizePool * 0.19),
        },
        {
          Winner: 3,
          prizePoolPercentage: 12,
          price: Math.round(maxPrizePool * 0.12),
        },
        {
          Winner: 4,
          prizePoolPercentage: 10,
          price: Math.round(maxPrizePool * 0.1),
        },
        {
          Winner: "5-7",
          prizePoolPercentage: 8,
          price: Math.round(maxPrizePool * 0.08),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 30,
          price: Math.round(maxPrizePool * 0.3),
        },
        {
          Winner: 2,
          prizePoolPercentage: 18,
          price: Math.round(maxPrizePool * 0.18),
        },
        {
          Winner: 3,
          prizePoolPercentage: 11,
          price: Math.round(maxPrizePool * 0.11),
        },
        {
          Winner: 4,
          prizePoolPercentage: 7.5,
          price: Math.round(maxPrizePool * 0.075),
        },
        {
          Winner: 5,
          prizePoolPercentage: 6,
          price: Math.round(maxPrizePool * 0.06),
        },
        {
          Winner: "6 - 10",
          prizePoolPercentage: 5.5,
          price: Math.round(maxPrizePool * 0.055),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 25,
          price: Math.round(maxPrizePool * 0.25),
        },
        {
          Winner: 2,
          prizePoolPercentage: 12.5,
          price: Math.round(maxPrizePool * 0.125),
        },
        {
          Winner: 3,
          prizePoolPercentage: 10,
          price: Math.round(maxPrizePool * 0.1),
        },
        {
          Winner: 4,
          prizePoolPercentage: 7.5,
          price: Math.round(maxPrizePool * 0.075),
        },
        {
          Winner: 5,
          prizePoolPercentage: 5,
          price: Math.round(maxPrizePool * 0.05),
        },
        {
          Winner: "6 - 15",
          prizePoolPercentage: 4,
          price: Math.round(maxPrizePool * 0.04),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 20,
          price: Math.round(maxPrizePool * 0.2),
        },
        {
          Winner: 2,
          prizePoolPercentage: 12,
          price: Math.round(maxPrizePool * 0.12),
        },
        {
          Winner: 3,
          prizePoolPercentage: 8,
          price: Math.round(maxPrizePool * 0.08),
        },
        {
          Winner: 4,
          prizePoolPercentage: 5,
          price: Math.round(maxPrizePool * 0.05),
        },
        {
          Winner: 5,
          prizePoolPercentage: 5,
          price: Math.round(maxPrizePool * 0.05),
        },
        {
          Winner: "6 - 25",
          prizePoolPercentage: 2.5,
          price: Math.round(maxPrizePool * 0.025),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 15,
          price: Math.round(maxPrizePool * 0.15),
        },
        {
          Winner: 2,
          prizePoolPercentage: 10,
          price: Math.round(maxPrizePool * 0.1),
        },
        {
          Winner: 3,
          prizePoolPercentage: 8,
          price: Math.round(maxPrizePool * 0.08),
        },
        {
          Winner: 4,
          prizePoolPercentage: 4,
          price: Math.round(maxPrizePool * 0.04),
        },
        {
          Winner: 5,
          prizePoolPercentage: 3,
          price: Math.round(maxPrizePool * 0.03),
        },
        {
          Winner: "6 - 10",
          prizePoolPercentage: 2,
          price: Math.round(maxPrizePool * 0.02),
        },
        {
          Winner: "11 - 25",
          prizePoolPercentage: 1.5,
          price: Math.round(maxPrizePool * 0.015),
        },
        {
          Winner: "26 - 50",
          prizePoolPercentage: 1.1,
          price: Math.round(maxPrizePool * 0.011),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 15,
          price: Math.round(maxPrizePool * 0.15),
        },
        {
          Winner: 2,
          prizePoolPercentage: 10,
          price: Math.round(maxPrizePool * 0.1),
        },
        {
          Winner: 3,
          prizePoolPercentage: 8,
          price: Math.round(maxPrizePool * 0.08),
        },
        {
          Winner: 4,
          prizePoolPercentage: 3.75,
          price: Math.round(maxPrizePool * 0.0375),
        },
        {
          Winner: 5,
          prizePoolPercentage: 3.5,
          price: Math.round(maxPrizePool * 0.035),
        },
        {
          Winner: "6 - 10",
          prizePoolPercentage: 1.5,
          price: Math.round(maxPrizePool * 0.015),
        },
        {
          Winner: "11 - 15",
          prizePoolPercentage: 1,
          price: Math.round(maxPrizePool * 0.01),
        },
        {
          Winner: "16 - 25",
          prizePoolPercentage: 0.6,
          price: Math.round(maxPrizePool * 0.006),
        },
        {
          Winner: "26 - 100",
          prizePoolPercentage: 0.55,
          price: Math.round(maxPrizePool * 0.0055),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 12,
          price: Math.round(maxPrizePool * 0.012),
        },
        {
          Winner: 2,
          prizePoolPercentage: 7.5,
          price: maxPrizePool * 0.075,
        },
        {
          Winner: 3,
          prizePoolPercentage: 5,
          price: Math.round(maxPrizePool * 0.05),
        },
        {
          Winner: 4,
          prizePoolPercentage: 3,
          price: Math.round(maxPrizePool * 0.03),
        },
        {
          Winner: 5,
          prizePoolPercentage: 2.25,
          price: Math.round(maxPrizePool * 0.0225),
        },
        {
          Winner: "6 - 10",
          prizePoolPercentage: 2,
          price: Math.round(maxPrizePool * 0.02),
        },
        {
          Winner: "11 - 15",
          prizePoolPercentage: 1,
          price: Math.round(maxPrizePool * 0.01),
        },
        {
          Winner: "16 - 25",
          prizePoolPercentage: 0.5,
          price: Math.round(maxPrizePool * 0.005),
        },
        {
          Winner: "26 - 50",
          prizePoolPercentage: 0.25,
          price: Math.round(maxPrizePool * 0.0025),
        },
        {
          Winner: "51 - 250",
          prizePoolPercentage: 0.22,
          price: Math.round(maxPrizePool * 0.0022),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 10,
          price: Math.round(maxPrizePool * 0.1),
        },
        {
          Winner: 2,
          prizePoolPercentage: 7,
          price: Math.round(maxPrizePool * 0.07),
        },
        {
          Winner: 3,
          prizePoolPercentage: 3.5,
          price: Math.round(maxPrizePool * 0.035),
        },
        {
          Winner: "4 - 5",
          prizePoolPercentage: 2.5,
          price: Math.round(maxPrizePool * 0.025),
        },
        {
          Winner: "6 - 10",
          prizePoolPercentage: 1,
          price: Math.round(maxPrizePool * 0.01),
        },
        {
          Winner: "11 - 25",
          prizePoolPercentage: 0.3,
          price: Math.round(maxPrizePool * 0.003),
        },
        {
          Winner: "26 - 100",
          prizePoolPercentage: 0.2,
          price: Math.round(maxPrizePool * 0.002),
        },
        {
          Winner: "101 - 250",
          prizePoolPercentage: 0.15,
          price: Math.round(maxPrizePool * 0.0015),
        },
        {
          Winner: "251 - 500",
          prizePoolPercentage: 0.11,
          price: Math.round(maxPrizePool * 0.0011),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 5,
          price: Math.round(maxPrizePool * 0.05),
        },
        {
          Winner: 2,
          prizePoolPercentage: 3,
          price: Math.round(maxPrizePool * 0.03),
        },
        {
          Winner: 3,
          prizePoolPercentage: 1.7,
          price: Math.round(maxPrizePool * 0.017),
        },
        {
          Winner: "4 - 10",
          prizePoolPercentage: 0.9,
          price: Math.round(maxPrizePool * 0.009),
        },
        {
          Winner: "11 - 50",
          prizePoolPercentage: 0.3,
          price: Math.round(maxPrizePool * 0.003),
        },
        {
          Winner: "51 - 100",
          prizePoolPercentage: 0.2,
          price: Math.round(maxPrizePool * 0.003),
        },
        {
          Winner: "101 - 500",
          prizePoolPercentage: 0.08,
          price: Math.round(maxPrizePool * 0.0008),
        },
        {
          Winner: "501 - 1000",
          prizePoolPercentage: 0.06,
          price: Math.round(maxPrizePool * 0.0006),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 5,
          price: Math.round(maxPrizePool * 0.05),
        },
        {
          Winner: 2,
          prizePoolPercentage: 3,
          price: Math.round(maxPrizePool * 0.03),
        },
        {
          Winner: 3,
          prizePoolPercentage: 2,
          price: Math.round(maxPrizePool * 0.02),
        },
        {
          Winner: "4 - 10",
          prizePoolPercentage: 1,
          price: Math.round(maxPrizePool * 0.01),
        },
        {
          Winner: "11 - 50",
          prizePoolPercentage: 0.2,
          price: Math.round(maxPrizePool * 0.002),
        },
        {
          Winner: "51 - 100",
          prizePoolPercentage: 0.1,
          price: Math.round(maxPrizePool * 0.001),
        },
        {
          Winner: "101 - 500",
          prizePoolPercentage: 0.05,
          price: Math.round(maxPrizePool * 0.0005),
        },
        {
          Winner: "501 - 1000",
          prizePoolPercentage: 0.04,
          price: Math.round(maxPrizePool * 0.0004),
        },
        {
          Winner: "1001 - 2000",
          prizePoolPercentage: 0.03,
          price: Math.round(maxPrizePool * 0.0003),
        },
      ],
      [
        {
          Winner: 1,
          prizePoolPercentage: 4,
          price: Math.round(maxPrizePool * 0.04),
        },
        {
          Winner: 2,
          prizePoolPercentage: 2,
          price: Math.round(maxPrizePool * 0.02),
        },
        {
          Winner: 3,
          prizePoolPercentage: 1,
          price: Math.round(maxPrizePool * 0.01),
        },
        {
          Winner: "4 - 10",
          prizePoolPercentage: 0.5,
          price: Math.round(maxPrizePool * 0.005),
        },
        {
          Winner: "11 - 50",
          prizePoolPercentage: 0.25,
          price: Math.round(maxPrizePool * 0.0025),
        },
        {
          Winner: "51 - 100",
          prizePoolPercentage: 0.1,
          price: Math.round(maxPrizePool * 0.001),
        },
        {
          Winner: "101 - 500",
          prizePoolPercentage: 0.05,
          price: Math.round(maxPrizePool * 0.0005),
        },
        {
          Winner: "501 - 1000",
          prizePoolPercentage: 0.021,
          price: Math.round(maxPrizePool * 0.00021),
        },
        {
          Winner: "1001 - 5000",
          prizePoolPercentage: 0.011,
          price: Math.round(maxPrizePool * 0.00011),
        },
      ],
    ];
    let size = contest_size / 2;
    let numberOfWinners = [];
    let tableDetails = [];
    let i = 0;
    globalNumberOfWinnerList.forEach((item) => {
      if (item <= size) {
        numberOfWinners.push(item);
        tableDetails.push(prizeDivisionList[i++]);
      }
    });

    let spots = parseInt(contest_size);
    let entry = parseInt(entry_fee);
    res.status(200).json({
      status: 1,
      maxPrizePool: maxPrizePool,
      spots: spots,
      entry: entry,
      match_id: match_id,
      contest_name: contest_name,
      numberOfWinners: numberOfWinners,
      tableDetails: tableDetails,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error ", error.message);
  }
};

function generateContestId(matchId) {
  const currentDate = Date.now();
  // const formattedDate = `${currentDate.getFullYear()}${
  //   currentDate.getMonth() + 1
  // }${currentDate.getDate()}`;
  const contestId = `${matchId}-${currentDate}`;
  // If the contest ID is shorter than 8 digits, pad with zeros
  const paddedContestId = contestId.padEnd(8, "0");
  // Ensure the contest ID is exactly 8 digits long
  return paddedContestId; //.slice(0, 8);
}

// create contest
const contestCreate = async (req, res) => {
  try {
    let {
      match_id,
      user_id,
      user_role,
      contest_id,
      contest_name,
      contest_size,
      entry_fee,
      flexible,
      prize_pool,
      is_private,
      total_winner,
      allow_multiple,
      // size_left,
      prize,
      status,
      payment_status,
    } = req.body;

    contest_id = generateContestId(user_id);

    const findMatch = await MatchList.findOne({ match_id: match_id });

    if (!findMatch) {
      return res.json({
        status: 0,
        message: "MatchID not exist",
      });
    }

    const findUser = await User.findOne({ _id: user_id });
    if (!findUser) {
      return res.json({
        status: 0,
        message: "User not exist",
      });
    }

    const searchConditions = {
      match_id,
      user_id,
      contest_name,
      contest_size,
      entry_fee,
      flexible,
      prize_pool,
    };

    const findContestID = await Contest.findOne(searchConditions);


    if (findContestID) {
      return res.json({
        status: 0,
        message: "same contest details already exists",
      });
    }
    if (!parseInt(payment_status)) {
      return res.json({
        status: 0,
        message: "Payment status false",
      });
    }
    ////////////////////////////////
    let findIndexOfTotalWinner;
    globalNumberOfWinnerList.filter((item, index) => {
      if (item == total_winner) findIndexOfTotalWinner = index;
    });
    let table_details;
    prizeDivisionList.filter((item, index) => {
      if (index == findIndexOfTotalWinner) table_details = item;
    });

    table_details.forEach((item) => {
      let price = (prize_pool * item.prizePoolPercentage) / 100;
      item.price = price;
    });
    ////////////////////////////////

    let rankArray = [];
    let prizePoolArray = [];
    let priceArray = [];
    table_details.forEach((item) => {
      rankArray.push(item.Winner);
      prizePoolArray.push(item.prizePoolPercentage);
      priceArray.push(item.price);
    });

    let contest = new Contest({
      match_id: match_id,
      user_id: user_id,
      user_role: user_role,
      contest_id: contest_id,
      contest_name: contest_name,
      contest_size: contest_size,
      entry_fee: entry_fee,
      flexible: flexible,
      prize_pool: prize_pool,
      is_private: is_private,
      total_winner: total_winner,
      allow_multiple: allow_multiple,
      size_left: contest_size,
      prize: prize,
      status: status,
      payment_status: payment_status,
      rank: rankArray,
      prize_pool_percent: prizePoolArray,
      winnings_amount: priceArray,
    });
    await contest.save();

    res.json({
      status: 1,
      contest_id: contest_id,
      message: "contest created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const contestListAdmin = async (req, res) => {
  try {
    const req_matchId = req.query.match_id;
    const user_id = req.query.user_id;
    if (!user_id) {
      return res.status(400).json({
        status: 0,
        message: "user_id is required",
      });
    }
    //  const findMatch = await Contest.find({ match_id: req_matchId, is_private: 'false' });
    const findMatch = await Contest.aggregate([
      {
        $match: { match_id: req_matchId, is_private: false },
      },
      {
        $lookup: {
          from: "joincontests",
          localField: "contest_id",
          foreignField: "contest_id",
          as: "joinContest",
        },
      },
      //  {
      //    $unwind: "$joinContest",
      //  },
      {
        $lookup: {
          from: "team1",
          localField: "joinContest.team_id",
          foreignField: "team_id",
          as: "joinTeam",
        },
      },
    ]);

    // console.log("findMatch", findMatch);

    const packet = [];

    findMatch.forEach((value) => {
      packet.push({
        contest_id: value["contest_id"],
        name: value["contest_name"],
        size: value["contest_size"],
        team_size: value["contest_size"],
        entry_fee: value["entry_fee"],
        prize_pool: value["prize_pool"],
        total_winner: value["total_winner"],
        size_left: value["size_left"],
        size_joined: value["contest_size"] - value["size_left"],
        team_details: value["joinTeam"],
      });
    });

    res.json({
      status: 1,
      message: "success",
      data: packet,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const myContestList = async (req, res) => {
  try {
    const req_matchId = req.query.match_id;
    const user_id = req.query.user_id;
    if (!user_id) {
      return res.status(400).json({
        status: 0,
        message: "user_id is required",
      });
    }
    //  const findMatch = await Contest.find({ match_id: req_matchId, is_private: 'false' });
    const findMatch = await joincontests.aggregate([
      {
        $match: { match_id: req_matchId, user_id: user_id },
      },
      {
        $lookup: {
          from: "contest1",
          localField: "contest_id",
          foreignField: "contest_id",
          as: "joinContest",
        },
      },
      {
        $unwind: "$joinContest", // Unwind the joinContest array
      },
      {
        $lookup: {
          from: "team1",
          localField: "team_id",
          foreignField: "team_id",
          as: "joinTeam",
        },
      },
      {
        $group: {
          _id: "$contest_id", // Group by contest_id
          joinContestData: { $first: "$joinContest" }, // Take the first joinContest data
          joinTeamData: { $push: "$joinTeam" }, // Collect joinTeam data into an array
        },
      },
      // {
      //   $unwind: "$joinTeamData", // Unwind the joinTeamData array
      // },
    ]);
    const packet = [];

    findMatch.forEach((value) => {
      packet.push({
        contest_id: value.joinContestData["contest_id"],
        name: value.joinContestData.contest_name,
        size: value.joinContestData.contest_size,
        team_size: value.joinContestData.contest_size,
        entry_fee: value.joinContestData.entry_fee,
        prize_pool: value.joinContestData.prize_pool,
        total_winner: value.joinContestData.total_winner,
        size_left: value.joinContestData.size_left,
        size_joined:
          value.joinContestData.contest_size - value.joinContestData.size_left,
        team_details: value.joinTeamData,
      });
    });

    res.json({
      status: 1,
      message: "success",
      data: packet,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

const contestDetails = async (req, res) => {
  try {
    const contest_id = req.query.contest_id;
    const value = await Contest.findOne({
      contest_id: contest_id,
    });

    let winnings = [];
    const rank = value.rank;
    const prize_pool_percent = value.prize_pool_percent;
    const winnings_amount = value.winnings_amount;

    for (let i = 0; i < rank.length; i++) {
      winnings.push({
        Winner: rank[i],
        prizePoolPercentage: prize_pool_percent[i],
        price: winnings_amount[i],
      });
    }
    res.json({
      status: 1,
      message: "success",
      contest_id: value["contest_id"],
      name: value["contest_name"],
      size: value["contest_size"],
      team_size: value["contest_size"],
      entry_fee: value["entry_fee"],
      prize_pool: value["prize_pool"],
      total_winner: value["total_winner"],
      size_left: value["size_left"],
      winnings: winnings,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};

module.exports = {
  prizePoolTable,
  contestCreate,
  contestListAdmin,
  myContestList,
  contestDetails,
};
