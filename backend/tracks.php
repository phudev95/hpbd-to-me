<?php
	require_once 'helpers/common.php';
	require_once 'vendor/SoundCloud.php';

	$tracks = array (
		'mp3' => 'https://soundcloud.com/ph-phan-v-n/hp-mp3',
		'ogg' => 'https://soundcloud.com/ph-phan-v-n/hp-ogg',
	);

	$type = 'mp3';
	if (!empty($_GET['type']) && $_GET['type'] = 'ogg')
		$type = 'ogg';

	$track = $tracks[$type];

	$SoundCloud = new SoundCloud;
	$SoundCloud->exec($track);
?>