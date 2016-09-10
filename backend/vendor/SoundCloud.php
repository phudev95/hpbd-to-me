<?php
	require_once 'Client.php';

	class SoundCloud {
		private $client_id = 'd59101951287e99753872fb3635b824a';
		private $api_resolve = 'https://api.soundcloud.com/resolve?url=%1$s&client_id=%2$s&_status_code_map%5B302%5D=200&_status_format=json';
		private $source_audio = '%1$s?client_id=%2$s';

		/**
		 * Get source audio
		 * @example http://api.soundcloud.com/tracks/282223354/stream?client_id=d59101951287e99753872fb3635b824a
		 * @param string $track
		 */
		public function exec ($track = ''){
			if (empty($track)) {
				sleep(2);
				header('HTTP/1.1 404 Not Found');
				exit;
			}

			$api_resolve = sprintf($this->api_resolve, $track, $this->client_id);
			$api_resolve_obj = $this->get_raw_data($api_resolve, true);

			if (!empty($api_resolve_obj->location)) {
				$api_track = str_replace('?client_id', '.json?client_id', $api_resolve_obj->location);
				$api_track_obj = $this->get_raw_data($api_track, true);

				if (!empty($api_track_obj)) {
					if ($api_track_obj->downloadable == 1) {
						$source_audio = sprintf($this->source_audio, $api_track_obj->download_url, $this->client_id);
					}
					else {
						$stream_http = str_replace('https', 'http', $api_track_obj->stream_url);
						$source_audio = sprintf($this->source_audio, $stream_http, $this->client_id);
					}

					header ('Location: ' . $source_audio);
				}
				else {
					sleep(2);
					header('HTTP/1.1 404 Not Found');
					echo 'Information empty track!';
					exit;
				}
			}
			else {
				sleep(2);
				header('HTTP/1.1 404 Not Found');
				echo 'Location is do not exist!';
				exit;
			}
		}

		/**
		 * Request link to parse raw data
		 * @param string $link
		 * @param bool   $json
		 * @return mixed|string
		 */
		protected function get_raw_data ($link = '', $json = false) {
			$browser = browser_request();
			$browser->execute($link);
			$raw_data = $browser->getResponseText();

			$result = '';
			if (!empty($raw_data))
				$result = $json ? json_decode($raw_data) : $raw_data;

			return $result;
		}
	}
?>