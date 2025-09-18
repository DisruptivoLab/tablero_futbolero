const mongoose = require('mongoose');
const Team = require('./models/Team');
const Player = require('./models/Player');

require('dotenv').config();

const updateManUtdRoster = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for roster update...');

    const manUtdTeam = await Team.findOne({ name: 'Manchester United' });

    if (!manUtdTeam) {
      console.error('Manchester United team not found in database.');
      mongoose.disconnect();
      return;
    }

    console.log(`Updating roster for ${manUtdTeam.name}...`);

    // 1. Delete existing players for Manchester United
    await Player.deleteMany({ team: manUtdTeam._id });
    console.log('Existing Man Utd players deleted.');

    // 2. Define new players
    let playerIdCounter = 1000; // Start from a higher number to avoid conflicts with seeded players
    const newPlayersData = [
      { playerId: playerIdCounter++, name: 'Senne Lammens', position: 'GK' },
      { playerId: playerIdCounter++, name: 'Altay Bayındır', position: 'GK' },
      { playerId: playerIdCounter++, name: 'Tom Heaton', position: 'GK' },
      { playerId: playerIdCounter++, name: 'Leny Yoro', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Lisandro Martínez', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Matthijs de Ligt', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Harry Maguire', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Ayden Heaven', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Tyler Fredricson', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Patrick Dorgu', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Luke Shaw', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Tyrell Malacia', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Diego León', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Diogo Dalot', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Noussair Mazraoui', position: 'DF' },
      { playerId: playerIdCounter++, name: 'Manuel Ugarte', position: 'MF' },
      { playerId: playerIdCounter++, name: 'Casemiro', position: 'MF' },
      { playerId: playerIdCounter++, name: 'Kobbie Mainoo', position: 'MF' },
      { playerId: playerIdCounter++, name: 'Bruno Fernandes', position: 'MF' },
      { playerId: playerIdCounter++, name: 'Mason Mount', position: 'MF' },
      { playerId: playerIdCounter++, name: 'Bryan Mbeumo', position: 'FW' },
      { playerId: playerIdCounter++, name: 'Amad Diallo', position: 'FW' },
      { playerId: playerIdCounter++, name: 'Matheus Cunha', position: 'FW' },
      { playerId: playerIdCounter++, name: 'Benjamin Sesko', position: 'FW' },
      { playerId: playerIdCounter++, name: 'Joshua Zirkzee', position: 'FW' },
      { playerId: playerIdCounter++, name: 'Chido Obi', position: 'FW' }
    ];

    // 3. Insert new players
    const playerDocs = newPlayersData.map(p => ({ ...p, team: manUtdTeam._id }));
    const createdPlayers = await Player.insertMany(playerDocs);
    console.log(`${createdPlayers.length} new players inserted.`);

    // 4. Update team's players array
    manUtdTeam.players = createdPlayers.map(p => p._id);
    await manUtdTeam.save();
    console.log('Man Utd team roster updated successfully.');

    console.log('\nRoster update completed successfully!');

  } catch (error) {
    console.error('\nError during roster update process:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

updateManUtdRoster();