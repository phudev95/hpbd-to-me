<?php
	require_once 'helpers/common.php';
	require_once 'vendor/SoundCloud.php';

	$tracks = array (
		'mp3' => 'https://soundcloud.com/ph-phan-v-n/hp-mp3',
		'ogg' => 'https://soundcloud.com/ph-phan-v-n/hp-ogg',
	);

	$type = 'mp3';
	if (!empty($_GET['type']) && $_GET['type'] == 'ogg')
		$type = 'ogg';

	$track = $tracks[$type];

	// Check cache
	$filename = base64_encode($track);
	$filepath = 'log/' . $filename;
	if (!$source_video = @file_get_contents($filepath)) {
		$SoundCloud = new SoundCloud;
		$source_video = $SoundCloud->exec($track);

		$file = fopen($filepath, 'w+');
		fwrite($file, $source_video);
		fclose($file);
	}

	header("Location: $source_video");
?>