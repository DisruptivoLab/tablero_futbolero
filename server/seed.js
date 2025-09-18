const mongoose = require('mongoose');
const League = require('./models/League');
const Team = require('./models/Team');
const Player = require('./models/Player');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding...');

    console.log('Clearing old data...');
    await Player.deleteMany({});
    await Team.deleteMany({});
    await League.deleteMany({});

    console.log('Creating Premier League...');
    const premierLeague = await League.create({
      name: 'Premier League',
      country: 'England',
      leagueId: 'premier-league'
    });

    console.log('Creating Big Six teams...');
    const teamsData = [
      { teamId: 'man-utd', name: 'Manchester United', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png', color: '#DA291C', textColor: '#FFFFFF' },
      { teamId: 'liverpool', name: 'Liverpool', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png', color: '#C8102E', textColor: '#FFFFFF' },
      { teamId: 'arsenal', name: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png', color: '#EF0107', textColor: '#FFFFFF' },
      { teamId: 'man-city', name: 'Manchester City', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png', color: '#6CABDD', textColor: '#000000' },
      { teamId: 'chelsea', name: 'Chelsea', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png', color: '#034694', textColor: '#FFFFFF' },
      { teamId: 'tottenham', name: 'Tottenham Hotspur', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/1200px-Tottenham_Hotspur.svg.png', color: '#132257', textColor: '#FFFFFF' }
    ];
    
    const teamPromises = teamsData.map(team => Team.create({ ...team, league: premierLeague._id }));
    const createdTeams = await Promise.all(teamPromises);
    console.log('Teams created successfully.');

    let playerIdCounter = 1;
    const playersData = {
      'man-utd': [
        { playerId: playerIdCounter++, name: 'Onana', position: 'GK' }, { playerId: playerIdCounter++, name: 'Bayindir', position: 'GK' }, { playerId: playerIdCounter++, name: 'Martinez', position: 'DF' }, { playerId: playerIdCounter++, name: 'Varane', position: 'DF' }, { playerId: playerIdCounter++, name: 'Maguire', position: 'DF' }, { playerId: playerIdCounter++, name: 'Shaw', position: 'DF' }, { playerId: playerIdCounter++, name: 'Dalot', position: 'DF' }, { playerId: playerIdCounter++, name: 'Wan-Bissaka', position: 'DF' }, { playerId: playerIdCounter++, name: 'Casemiro', position: 'MF' }, { playerId: playerIdCounter++, name: 'Mainoo', position: 'MF' }, { playerId: playerIdCounter++, name: 'Eriksen', position: 'MF' }, { playerId: playerIdCounter++, name: 'Fernandes', position: 'MF' }, { playerId: playerIdCounter++, name: 'Mount', position: 'MF' }, { playerId: playerIdCounter++, name: 'Antony', position: 'FW' }, { playerId: playerIdCounter++, name: 'Rashford', position: 'FW' }, { playerId: playerIdCounter++, name: 'Garnacho', position: 'FW' }, { playerId: playerIdCounter++, name: 'Hojlund', position: 'FW' }, { playerId: playerIdCounter++, name: 'Martial', position: 'FW' }
      ],
      'liverpool': [
        { playerId: playerIdCounter++, name: 'Alisson', position: 'GK' }, { playerId: playerIdCounter++, name: 'Kelleher', position: 'GK' }, { playerId: playerIdCounter++, name: 'Van Dijk', position: 'DF' }, { playerId: playerIdCounter++, name: 'Konate', position: 'DF' }, { playerId: playerIdCounter++, name: 'Gomez', position: 'DF' }, { playerId: playerIdCounter++, name: 'Robertson', position: 'DF' }, { playerId: playerIdCounter++, name: 'Alexander-Arnold', position: 'DF' }, { playerId: playerIdCounter++, name: 'Endo', position: 'MF' }, { playerId: playerIdCounter++, name: 'Mac Allister', position: 'MF' }, { playerId: playerIdCounter++, name: 'Szoboszlai', position: 'MF' }, { playerId: playerIdCounter++, name: 'Jones', position: 'MF' }, { playerId: playerIdCounter++, name: 'Elliott', position: 'MF' }, { playerId: playerIdCounter++, name: 'Salah', position: 'FW' }, { playerId: playerIdCounter++, name: 'Nunez', position: 'FW' }, { playerId: playerIdCounter++, name: 'Jota', position: 'FW' }, { playerId: playerIdCounter++, name: 'Gakpo', position: 'FW' }, { playerId: playerIdCounter++, name: 'Diaz', position: 'FW' }
      ],
      'arsenal': [
        { playerId: playerIdCounter++, name: 'Raya', position: 'GK' }, { playerId: playerIdCounter++, name: 'Ramsdale', position: 'GK' }, { playerId: playerIdCounter++, name: 'Saliba', position: 'DF' }, { playerId: playerIdCounter++, name: 'Gabriel', position: 'DF' }, { playerId: playerIdCounter++, name: 'White', position: 'DF' }, { playerId: playerIdCounter++, name: 'Zinchenko', position: 'DF' }, { playerId: playerIdCounter++, name: 'Tomiyasu', position: 'DF' }, { playerId: playerIdCounter++, name: 'Rice', position: 'MF' }, { playerId: playerIdCounter++, name: 'Odegaard', position: 'MF' }, { playerId: playerIdCounter++, name: 'Havertz', position: 'MF' }, { playerId: playerIdCounter++, name: 'Partey', position: 'MF' }, { playerId: playerIdCounter++, name: 'Jorginho', position: 'MF' }, { playerId: playerIdCounter++, name: 'Saka', position: 'FW' }, { playerId: playerIdCounter++, name: 'Martinelli', position: 'FW' }, { playerId: playerIdCounter++, name: 'Trossard', position: 'FW' }, { playerId: playerIdCounter++, name: 'Jesus', position: 'FW' }, { playerId: playerIdCounter++, name: 'Nketiah', position: 'FW' }
      ],
      'man-city': [
        { playerId: playerIdCounter++, name: 'Ederson', position: 'GK' }, { playerId: playerIdCounter++, name: 'Ortega', position: 'GK' }, { playerId: playerIdCounter++, name: 'Dias', position: 'DF' }, { playerId: playerIdCounter++, name: 'Stones', position: 'DF' }, { playerId: playerIdCounter++, name: 'Ake', position: 'DF' }, { playerId: playerIdCounter++, name: 'Gvardiol', position: 'DF' }, { playerId: playerIdCounter++, name: 'Akanji', position: 'DF' }, { playerId: playerIdCounter++, name: 'Walker', position: 'DF' }, { playerId: playerIdCounter++, name: 'Rodri', position: 'MF' }, { playerId: playerIdCounter++, name: 'De Bruyne', position: 'MF' }, { playerId: playerIdCounter++, name: 'Silva', position: 'MF' }, { playerId: playerIdCounter++, name: 'Kovacic', position: 'MF' }, { playerId: playerIdCounter++, name: 'Foden', position: 'FW' }, { playerId: playerIdCounter++, name: 'Grealish', position: 'FW' }, { playerId: playerIdCounter++, name: 'Doku', position: 'FW' }, { playerId: playerIdCounter++, name: 'Alvarez', position: 'FW' }, { playerId: playerIdCounter++, name: 'Haaland', position: 'FW' }
      ],
      'chelsea': [
        { playerId: playerIdCounter++, name: 'Petrovic', position: 'GK' }, { playerId: playerIdCounter++, name: 'Sanchez', position: 'GK' }, { playerId: playerIdCounter++, name: 'Disasi', position: 'DF' }, { playerId: playerIdCounter++, name: 'Badiashile', position: 'DF' }, { playerId: playerIdCounter++, name: 'Colwill', position: 'DF' }, { playerId: playerIdCounter++, name: 'Gusto', position: 'DF' }, { playerId: playerIdCounter++, name: 'Chilwell', position: 'DF' }, { playerId: playerIdCounter++, name: 'James', position: 'DF' }, { playerId: playerIdCounter++, name: 'Caicedo', position: 'MF' }, { playerId: playerIdCounter++, name: 'Fernandez', position: 'MF' }, { playerId: playerIdCounter++, name: 'Gallagher', position: 'MF' }, { playerId: playerIdCounter++, name: 'Lavia', position: 'MF' }, { playerId: playerIdCounter++, name: 'Palmer', position: 'FW' }, { playerId: playerIdCounter++, name: 'Sterling', position: 'FW' }, { playerId: playerIdCounter++, name: 'Mudryk', position: 'FW' }, { playerId: playerIdCounter++, name: 'Nkunku', position: 'FW' }, { playerId: playerIdCounter++, name: 'Jackson', position: 'FW' }
      ],
      'tottenham': [
        { playerId: playerIdCounter++, name: 'Vicario', position: 'GK' }, { playerId: playerIdCounter++, name: 'Forster', position: 'GK' }, { playerId: playerIdCounter++, name: 'Romero', position: 'DF' }, { playerId: playerIdCounter++, name: 'van de Ven', position: 'DF' }, { playerId: playerIdCounter++, name: 'Porro', position: 'DF' }, { playerId: playerIdCounter++, name: 'Udogie', position: 'DF' }, { playerId: playerIdCounter++, name: 'Bissouma', position: 'MF' }, { playerId: playerIdCounter++, name: 'Sarr', position: 'MF' }, { playerId: playerIdCounter++, name: 'Maddison', position: 'MF' }, { playerId: playerIdCounter++, name: 'Bentancur', position: 'MF' }, { playerId: playerIdCounter++, name: 'Kulusevski', position: 'FW' }, { playerId: playerIdCounter++, name: 'Johnson', position: 'FW' }, { playerId: playerIdCounter++, name: 'Son', position: 'FW' }, { playerId: playerIdCounter++, name: 'Richarlison', position: 'FW' }, { playerId: playerIdCounter++, name: 'Werner', position: 'FW' }
      ]
    };

    console.log('Populating teams with players...');
    for (const team of createdTeams) {
      const teamPlayers = playersData[team.teamId];
      if (teamPlayers) {
        const playerDocs = teamPlayers.map(p => ({ ...p, team: team._id }));
        const createdPlayers = await Player.insertMany(playerDocs);
        team.players = createdPlayers.map(p => p._id);
        await team.save();
      }
    }
    console.log('Players added to teams successfully.');

    premierLeague.teams = createdTeams.map(team => team._id);
    await premierLeague.save();
    console.log('Updated teams in Premier League.');

    console.log('\nSeeding completed successfully!');

  } catch (error) {
    console.error('\nError during seeding process:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedDatabase();