<?php

define('BLOOD_TYPES', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
define('GENDERS', ['male', 'female']);
define('URGENCY_LEVELS', ['normal', 'urgent', 'critical']);
define('REQUEST_STATUSES', ['open', 'fulfilled', 'cancelled']);
define('DONATION_STATUSES', ['pending', 'accepted', 'rejected', 'completed']);
define('USER_ROLES', ['user', 'admin']);
define('BLOOD_COMPATIBILITY', [
    'O-'  => ['O-'],
    'O+'  => ['O-', 'O+'],
    'A-'  => ['O-', 'A-'],
    'A+'  => ['O-', 'O+', 'A-', 'A+'],
    'B-'  => ['O-', 'B-'],
    'B+'  => ['O-', 'O+', 'B-', 'B+'],
    'AB-' => ['O-', 'A-', 'B-', 'AB-'],
    'AB+' => ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
]);
