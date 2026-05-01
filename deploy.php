<?php

$secret = "my_super_secret_token_swasthavritti_tech";

$repoPath   = "/home/wa16d1ooo3pv/repositories/swasthavritti_tech";
$deployPath = "/home/wa16d1ooo3pv/public_html/swasthavritti.com";

// ----- Verify GitHub Webhook Signature -----
$headers = getallheaders();
$payload = file_get_contents("php://input");
$hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!isset($headers['X-Hub-Signature-256']) ||
    !hash_equals($hash, $headers['X-Hub-Signature-256'])) {
    http_response_code(403);
    exit("Invalid signature");
}

$output = [];

$output[] = "Starting deployment...";

// 1. Pull latest code from GitHub
exec("cd $repoPath && git pull origin main 2>&1", $output);

// 2. Copy files to live domain folder
// Using '.'' ensures hidden files also copy correctly
exec("cp -Rf {$repoPath}/. {$deployPath}/ 2>&1", $output);

$output[] = "Deployment finished.";

echo "<pre>";
print_r($output);
echo "</pre>";
