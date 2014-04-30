Regis
=====

Régis is an HTML5 personal accounts information register.
It helps you keep track of your login information for different sites and services by locking them under a single name and password combination.

Régis can work offline too, meaning you can still access your information even if you can't connect to a server running Régis.
This is achieved by storing the information register inside the browser local storage when in offline mode and forcing caching of Régis code using the cahce manifest.

The backend is build with Node.js + Express.
The data is stored inside Comma Separated Value (CSV) files.

Security:

Confidential data (user names's and passwords) is encrypted using the Vigenère cipher (http://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher)
While they are statistical methods to break this cipher, in the context of this application (encrypting short, 'meaningless' strings) it will keep your data secure if you follow these rules:
- Régis accept any unicode character in the password string, so be sure that you use a mix of letters, numbers and symbols when choosing a password for the register.
- Choose a register password that will be as long or longer than most of your existing passwords and user names. This will make the encryption very strong.


Support for multiple users, anonymous: 

Régis can handle multiple users, each user getting her own dedicated CSV file to hold her register data.
IMPORTANT: Régis does not keep a record of the name and password you used to create the register, it actually does not keep a record of its users, the only information that matters to Régis is the register which can be identified by the name of the user encrypted using her password. The benefit is that the registers are anonymous, but the downside is that Régis WILL NOT BE ABLE TO RETURN OR RESET YOUR PASSWORD OR USERNAME IF YOU FORGET THEM!

Another effect of this is that two different users can share the same name as long as their passwords are different.

Licence:

The MIT License (MIT)

Copyright (c) 2014 Jonathan Cremieux

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
