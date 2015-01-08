<?php
$ch = curl_init("https://pod.ponk.pink/people/810714e06f110132ea42040127f0dc01.json");
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_exec($ch);
curl_close($ch);
?>
