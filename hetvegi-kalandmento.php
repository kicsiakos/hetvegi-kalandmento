<?php

/**
 * Plugin Name: Hetvegi Kalandmento 
 * Description: Egy kis segítség a hétvégi tevékenységek megtervezéséhez.
 * Version: 1.0
 * Author: Ákos Kiss
 */

if (!defined('ABSPATH')) {
    exit;
}

function hetvegi_kalandmento_enqueue_assets()
{
    $js_file  = plugin_dir_url(__FILE__) . 'dist/assets/index.js';
    $css_file = plugin_dir_url(__FILE__) . 'dist/assets/index.css';

    wp_enqueue_style(
        'hetvegi-kalandmento-style',
        $css_file,
        array(),
        '1.0.0'
    );

    wp_enqueue_script(
        'hetvegi-kalandmento-script',
        $js_file,
        array(),
        '1.0.0',
        true
    );
}

function hetvegi_kalandmento_script_type_attribute($tag, $handle, $src)
{
    if ('hetvegi-kalandmento-script' === $handle) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}

add_filter('script_loader_tag', 'hetvegi_kalandmento_script_type_attribute', 10, 3);

function hetvegi_kalandmento_shortcode($atts)
{
    hetvegi_kalandmento_enqueue_assets();

    return '<div id="hetvegi-kalandmento--root"></div>';
}

add_shortcode('hetvegi_kalandmento', 'hetvegi_kalandmento_shortcode');
