Casper netsniff Spider
======================

This is a mashup of casper netsniff with spider.js, which combined became an automated performance testing script.

**Disclaimer:** Spider.js is a very useful script I grabbed from the internet, and the author should be the owner of this blog - [http://planzero.org/blog/2013/03/07/spidering_the_web_with_casperjs][1]

This mashup has integrated casper netsniff functions into spider.js, which let's you to crawl through the whole site by specify an entry point, and for each link it sees, it will take screenshot as well as generate har file for you.

**Usage**

casper netsniff-spider.js your_site_entry_point

**Troubleshooting**

You may need to create 2 folders in the same directory as your netsniff-spider.js,  one is 'har/' and the other one is 'png'.  Feel free to contact iroy2000 [at] gmail.com if you have any questions. 


**Here is some sample screenshots** 

 - **Capture Screenshot for each link it crawled**

![image alt][2]

 - **You can view your performance metrics with the file generated**
 

 ![image alt][3]


  [1]: http://planzero.org/blog/2013/03/07/spidering_the_web_with_casperjs
  [2]: https://lh6.googleusercontent.com/-x2JcqiD7SWY/UZWIVYxxEeI/AAAAAAAAQlU/X7zdqvxvC30/w1009-h373-no/Screen+Shot+2013-05-16+at+6.30.26+PM.png
  [3]: https://lh6.googleusercontent.com/-d2QmByZWTmo/UZWImntfwJI/AAAAAAAAQlc/VVEIewmXMmo/w846-h550-no/Screen+Shot+2013-05-16+at+6.31.45+PM.png
