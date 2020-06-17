<?php

/**
 * Dashboard class.
 *
 * Responsible for adding the stories dashboard to WordPress admin.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories;
use WP_REST_Request;

class Cron
{

	public static function refresh()
	{
		// call gliastudio list api
		// update

		$response = file_get_contents(dirname(dirname(__FILE__))."/tests/stories/fake_data.json");
		// $response = file_get_contents("http://gstudio.gliacloud.com/api/stories/?username=gliacloud");
		$result = json_decode($response, true);

		foreach ($result["payload"] as $story) {
			if ($story["status"] == "DONE") {
				// TODO: check if story is exist already

				// update post via api
				$request = new WP_REST_Request( 'POST', '/wp/v2/web-story' );
				$request->set_query_params( [
					'content'=> $story["extra"]["content"],
					"pages"=>$story["extra"]["story_data"],
					'status'=>"draft",
					"story_data"=>$story["extra"]["story_data"]
				 ] );

				$response = rest_do_request( $request );
				$server = rest_get_server();
				$data = $server->response_to_data( $response, false );
				$json = wp_json_encode( $data );
			}
		}
	}
}
