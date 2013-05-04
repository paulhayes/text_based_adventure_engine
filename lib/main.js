/*
   Copyright 2013 Paul Hayes

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

var main = {};

require('./coreextension');

main.Player = require('./player');
main.Room = require('./room');
main.Door = require('./door');
main.Dice = require('./dice');
main.Television = require('./television');
main.Clock = require('./clock');
main.Shell = require('./shell');

module.exports = main;