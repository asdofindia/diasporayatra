<?php
/*
Credits:
http://www.freecontactform.com/email_form.php
http://php.net/manual/en/filter.filters.sanitize.php
*/

$emailto = "diasporayatra@inventati.org";
$emailsubject = "New message for diaspora yatra";

function trim_value(&$value)
{
  $value = trim($value);    // this removes whitespace and related characters from the beginning and end of the string
}

array_filter($_POST, 'trim_value');    // the data in $_POST is trimmed

$postfilter =    // set up the filters to be used with the trimmed post array
array(
  'email2'                        =>    array('filter' => FILTER_SANITIZE_EMAIL),
  'name2'                            =>    array('filter' => FILTER_SANITIZE_STRING),
  'message2'                            =>    array('filter' => FILTER_SANITIZE_STRING),
  'captcha'                                     =>    array('filter' => FILTER_SANITIZE_NUMBER_INT)
);

$revised_post_array = filter_var_array($_POST, $postfilter);    // must be referenced via a variable which is now an array that takes the place of $_POST[]

function isWasteString($question){
  return (!isset($question) || trim($question)==='');
}

function clean_string($string) {
  $bad = array("content-type","bcc:","to:","cc:","href");
  return str_replace($bad,"",$string);
}

function captchapass($captcharesponse){
  return (strcmp($captcharesponse,"4"));
}

$message = clean_string($revised_post_array["message2"]);
$captcharesponse = $revised_post_array["captcha"];

if (isWasteString($message)){
  $finalmessage="Please enter a valid message.";
}
elseif (!captchapass($captcharesponse)){
  $finalmessage = "Sorry computers are not allowed to email humans.";
}
else {

  $fromemail = !isWasteString($revised_post_array["email2"]) ? $revised_post_array["email2"] : "anonymous@example.com";
  $fromname = !isWasteString($revised_post_array["name2"]) ? clean_string($revised_post_array["name2"]) : "anonymous";


  $headers = 'From: '.$fromemail."\r\n".
  'Reply-To: '.$fromemail."\r\n" .
  'X-Mailer: PHP/' . phpversion();
  @mail($emailto, $emailsubject, $message, $headers);

  $finalmessage = "Thank you for that awesome message!";
}
//TODO captchas from https://github.com/mokah/PHP-Contact-Form
echo <<<EOT
<!doctype html>
<html>
  <head>
    <title>Diaspora Yatra</title>
    <link href="css/contactform.min.css" rel="stylesheet" type='text/css'>
  </head>
  <body>
    <div id="container">
      <p id="message">$finalmessage</p>
      <a id="goback" href="/">Go back to the campaign page</a>
    </div>
  </body>
</html>
EOT;
?>
