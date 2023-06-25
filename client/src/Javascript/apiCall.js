import { ToastContainer, toast } from 'react-toastify';

// on vien faire une requête a notre backend
export async function apiCall(method, path, data = false) {
  try {
    const response = await fetch(`http://localhost:8080/ws/${path}`, {
      method: method,
      credentials: "include",
      headers: data ? {
        "Content-Type": "application/json",
      } : {},
      body: data ? JSON.stringify(data) : undefined,
    });

    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      toast.error(json.message, {
        position: toast.POSITION.TOP_RIGHT
      });
      return false;
    }
  } catch (error) {
    toast.error("Error", {
      position: toast.POSITION.TOP_RIGHT
    });
  }
}

// on crée les données pour afficher les tournois
export async function convertToBracketData(matches, data) {
  const updatedMatches = [];
  const maxStep = Math.ceil(Math.log2(matches.length * 2));

  const stepZeroMatches = matches.filter(match => match.step === 0);
  const countStepZeroMatches = stepZeroMatches.length;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    let isWinnerPlayer1;
    let isWinnerPlayer2;
    if (match.score1_player1 === null || match.score1_player2 === null) {
      isWinnerPlayer1 = false;
      isWinnerPlayer2 = false;
    } else {
      isWinnerPlayer1 = await isWinner(match)
      isWinnerPlayer2 = await !isWinner(match)
    }
    const nextMatchId = calculateNextMatchId(matches, match.id);
    const matchObj = {
      id: i + 1,
      matchId: match.id || null,  
      nextMatchId: nextMatchId,
      tournamentRoundText: match.step,
      startTime: data.date_start.slice(0,10),
      state: 'RUNNING',
      participants: [
        {
          id: match.fk_user1_id,
          resultText: match.score1_player1 || null,
          isWinner: await isWinner(match),
          status: null,
          name: match.users[0].username,
          picture: 'teamlogos/client_team_default_logo',
        },
        {
          id: match.fk_user2_id,
          resultText: match.score2_player1 || null,
          isWinner: await !isWinner(match),
          status: null,
          name: match.users[1].username,
          picture: 'teamlogos/client_team_default_logo',
        },
      ],
    };

    updatedMatches.push(matchObj);
  }

  //const totalMatches = countStepZeroMatches * 2 - 1;
  const totalMatches = countStepZeroMatches * 2 - 1;
  const nextMatches = createNextMatches(updatedMatches, totalMatches - matches.length);
  updatedMatches.push(...nextMatches);

  return updatedMatches;
}

 /* function createNextMatches(matches, nbMatches) {
  const nextMatches = [];
  let nextMatchId = matches.length + 1;

  for (let i = 1; i < nbMatches + 1; i++) {
    let calculatedNextMatchId = calculateNextMatchId(matches, matches.length + i);
    calculatedNextMatchId += 3
    if (i == nbMatches) {
      const matchObj2 = {
        id: i + matches.length,
        matchId: null,
        nextMatchId: null,
        tournamentRoundText: 0,
        startTime: "",
        state: "RUNNING",
        participants: []
      };
      nextMatches.push(matchObj2);
    } else {
      const matchObj = {
        id: i + matches.length,
        nextMatchId: calculatedNextMatchId,
        tournamentRoundText: 0,
        startTime: "",
        state: "RUNNING",
        participants: []
      };
      nextMatches.push(matchObj);
    }



    nextMatchId++; // Incrémentation de nextMatchId pour le prochain match
  }

  return nextMatches;
} */

function createNextMatches(matches, nbMatches) {
  const nextMatches = [];
  let nextMatchId = matches.length + 1;
  const countStepZeroMatches = matches.reduce((count, match) => {
    if (match.tournamentRoundText === 0) {
      return count + 1;
    } else {
      return count;
    }
  }, 0);
  for (let i = 1; i < nbMatches + 1; i++) {
    let calculatedNextMatchId = calculateNextMatchId(matches, countStepZeroMatches + i);
    calculatedNextMatchId += countStepZeroMatches + nbMatches
    
    if (i == nbMatches) {
      const matchObj2 = {
        id: i + matches.length,
        matchId: null,
        nextMatchId: null,
        tournamentRoundText: 0,
        startTime: "",
        state: "RUNNING",
        participants: []
      };
      nextMatches.push(matchObj2);
    } else {
      const matchObj = {
        id: i + matches.length,
        nextMatchId: calculatedNextMatchId,
        tournamentRoundText: 0,
        startTime: "",
        state: "RUNNING",
        participants: []
      };
      nextMatches.push(matchObj);
    }



    nextMatchId++; // Incrémentation de nextMatchId pour le prochain match
  }

  return nextMatches;
}

function calculateNextMatchId(matches, currentMatchId) {
  if (matches) {
    const countStepZeroMatches = matches.reduce((count, match) => {
      if (match.step === 0) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);
    
    const matchCount = countStepZeroMatches;
    if (matchCount === 1) {
      return null; // Pas de match suivant s'il y a un seul match
    }

    const index = matches.findIndex(match => match.id === currentMatchId);
    const nextMatchIndex = Math.ceil((index + 1) / 2);
    const nextMatchId = matchCount + nextMatchIndex;
    return nextMatchId;
  }
}

export async function convertToBracketData2(matches) {

  const match = [
    {
      id: 19753,
      nextMatchId: null,
      tournamentRoundText: "3",
      startTime: "2021-05-30",
      state: "SCHEDULED",
      participants: [
      ]
    },

    {
      id: 19754,
      nextMatchId: 19753,
      tournamentRoundText: "2",
      startTime: "2021-05-30",
      state: "SCHEDULED",
      participants: [
        {
          id: "14754a1a-932c-4992-8dec-f7f94a339960",
          resultText: null,
          isWinner: false,
          status: null,
          name: "CoKe BoYz",
          picture: "teamlogos/client_team_default_logo",
        }
      ]
    },
    {
      id: 19755,
      nextMatchId: 19754,
      tournamentRoundText: "1",
      startTime: "2021-05-30",
      state: "SCORE_DONE",
      participants: [
        {
          id: "14754a1a-932c-4992-8dec-f7f94a339960",
          resultText: "Won",
          isWinner: true,
          status: "PLAYED",
          name: "CoKe BoYz",
          picture: "teamlogos/client_team_default_logo",
        },
        {
          id: "d16315d4-7f2d-427b-ae75-63a1ae82c0a8",
          resultText: "Lost",
          isWinner: false,
          status: "PLAYED",
          name: "Aids Team",
          picture: "teamlogos/client_team_default_logo",
        }
      ]
    },
    {
      id: 19756,
      nextMatchId: 19754,
      tournamentRoundText: "1",
      startTime: "2021-05-30",
      state: "RUNNING",
      participants: [
        {
          id: "d8b9f00a-0ffa-4527-8316-da701894768e",
          resultText: null,
          isWinner: false,
          status: null,
          name: "Art of kill",
          picture: "teamlogos/client_team_default_logo",
        }
      ]
    },
    {
      id: 19757,
      nextMatchId: 19753,
      tournamentRoundText: "2",
      startTime: "2021-05-30",
      state: "SCHEDULED",
      participants: [
      ]
    },
    {
      id: 19758,
      nextMatchId: 19757,
      tournamentRoundText: "1",
      startTime: "2021-05-30",
      state: "SCHEDULED",
      participants: [
        {
          id: "9397971f-4b2f-44eb-a094-722eb286c59b",
          resultText: null,
          isWinner: false,
          status: null,
          name: "Crazy Pepes",
          picture: "teamlogos/client_team_default_logo",
        }
      ]
    },
    {
      id: 19759,
      nextMatchId: 19757,
      tournamentRoundText: "1",
      startTime: "2021-05-30",
      state: "SCHEDULED",
      participants: [
        {
          id: "42fecd89-dc83-4821-80d3-718acb50a30c",
          resultText: null,
          isWinner: false,
          status: null,
          name: "BLUEJAYS",
          picture: "teamlogos/client_team_default_logo",
        },
        {
          id: "df01fe2c-18db-4190-9f9e-aa63364128fe",
          resultText: null,
          isWinner: false,
          status: null,
          name: "Bosphorus",
          picture: "teamlogos/r7zn4gr8eajivapvjyzd",
        }
      ]
    }]
  return match
}






// On vérifie qui est le gagnant du match en comparant les scores
export async function isWinner(match) {
  if (match.score1_player1 === match.score1_player2 && match.score2_player1 === match.score2_player2) {
    if (match.score1_player1 > match.score2_player1) {
      return true
    } else {
      return false
    }
  }

};