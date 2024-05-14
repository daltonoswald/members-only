#! /usr/bin/env node
const bcrypt = require('bcryptjs');

console.log(
    'This script populates some test users and messages to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const User = require('./models/user');
  const Message = require("./models/message");
  
  const users = [];
  const messages = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createUsers();
    await createMessages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function userCreate(index, first_name, last_name, username, password, isMember, isAdmin) {
    const userdetail = {
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: await bcrypt.hash(password, 10),
        isMember: isMember,
        isAdmin: isAdmin };
  
    const user = new User(userdetail);
  
    await user.save();
    users[index] = user;
    console.log(`Added user: ${username}`);
  }
  
  async function messageCreate(index, title, author, text, date) {
    const messagedetail = {
      title: title,
      author: author,
      text: text,
      date: date
    };
  
    const message = new Message(messagedetail);
    await message.save();
    messages[index] = message;
    console.log(`Added message: ${title}`);
  }
  
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([
        userCreate(0, 'Dougie', 'Graves', 'Kharon', 'dontguessthis123', true, true),
        userCreate(1, 'John', 'Doe', 'Jodney', 'minecraft12', true, false,),
        userCreate(2, 'Ana', 'Shantay', 'Inabarrel', 'touristTrap', true, false),
        userCreate(3, 'Billy', 'Andie', 'K00lReptar', 'passw3rd', false, false)
    ]);
  }
  
  async function createMessages() {
    console.log("Adding messages");
    await Promise.all([
      messageCreate(0, 'Welcome', users[0], 'Welcome to the Message Club', new Date("May 13, 2024 11:49:00")),
      messageCreate(1, 'First', users[1], 'FIRST I WAS THE FIRST', new Date("May 13, 2024 11:55:00")),
      messageCreate(2, 'Idiot', users[2], 'John is an idiot, you were the second message', new Date("May 13, 2024 12:29:00"))
    ]);
  }
