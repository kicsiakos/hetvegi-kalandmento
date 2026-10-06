<?php

add_action('rest_api_init', function () {
    register_rest_route('hetvegi-kalandmento', '/all-programs/', [
        'methods' => 'GET',
        'callback' => 'get_all_programs',
        'permission_callback' => '__return_true',
    ]);
});

function get_all_programs()
{
    $json_file_path = HKM_PLUGIN_DIR . 'data/programs.json';

    if (!file_exists($json_file_path)) {
        return new WP_Error(
            'file_not_found',
            'File not found.',
            array('status' => 404)
        );
    }

    $json_content = file_get_contents($json_file_path);
    $data = json_decode($json_content, true);

    if (!$data || !isset($data['programs'])) {
        return new WP_Error(
            'invalid_json',
            'Invalid JSON format.',
            array('status' => 500)
        );
    }

    $reference_time_str = isset($data['reference_time']) ? $data['reference_time'] : '2026-10-09T12:00:00+02:00';
    $reference_timestamp = strtotime($reference_time_str);

    $processed_programs = array();

    foreach ($data['programs'] as $program) {
        $capacity = isset($program['capacity']) ? max(0, intval($program['capacity'])) : 0;
        $booked   = isset($program['booked']) ? max(0, intval($program['booked'])) : 0;
        $free     = max(0, $capacity - $booked);

        $start_at = isset($program['start_at']) ? $program['start_at'] : null;
        $start_timestamp = $start_at ? strtotime($start_at) : 0;
        $cancelled = !empty($program['cancelled']);

        if ($cancelled) {
            $status_key   = 'cancelled';
            $status_label = 'Lemondva';
            $bookable     = false;
        } elseif ($start_timestamp && $start_timestamp < $reference_timestamp) {
            $status_key   = 'past';
            $status_label = 'Már lezajlott';
            $bookable     = false;
        } elseif ($capacity <= 0 || $free <= 0) {
            $status_key   = 'full';
            $status_label = 'Betelt';
            $bookable     = false;
        } elseif ($capacity > 0 && ($free / $capacity) <= 0.20) {
            $status_key   = 'few_left';
            $status_label = 'Már csak néhány hely';
            $bookable     = true;
        } else {
            $status_key   = 'available';
            $status_label = 'Foglalható';
            $bookable     = true;
        }

        $processed_programs[] = array(
            'id'          => isset($program['id']) ? intval($program['id']) : 0,
            'title'       => !empty($program['title']) ? sanitize_text_field($program['title']) : 'Névtelen program',
            'location'    => !empty($program['location']) ? sanitize_text_field($program['location']) : 'Helyszín hiányzik',
            'start_at'    => $start_at,
            'capacity'    => $capacity,
            'booked'      => $booked,
            'free_places' => $free,
            'difficulty'  => !empty($program['difficulty']) ? sanitize_text_field($program['difficulty']) : 'Nem meghatározott',
            'price_huf'   => isset($program['price_huf']) ? max(0, intval($program['price_huf'])) : 0,
            'cancelled'   => $cancelled,
            'status'      => array(
                'key'      => $status_key,
                'label'    => $status_label,
                'bookable' => $bookable,
            ),
        );
    }

    return rest_ensure_response(array(
        'reference_time' => $reference_time_str,
        'programs'       => $processed_programs,
    ));
}
