<?php

namespace Drupal\pennlib_usertasks\Controller;

use Drupal\user\Controller\UserController;
use Drupal\user\UserInterface;

class PennlibUserController extends UserController {

  /**
   * {@inheritdoc}
   */
  public function userTitle(UserInterface $user = NULL) {
    // This function returns a new title for the user page.
    // The new title should be the user's first and last name (or whichever exist).
    // If neither exist, default back to the username.
    $first = $user->field_first_name->value;
    $last = $user->field_last_name->value;
    $newtitle = "";
    if ($first) {
      $newtitle .= $first . " ";
    }
    if ($last) {
      $newtitle .= $last;
    }
    if ($newtitle == "") {
      $newtitle = $user->getUsername();
    }
    return $newtitle;
  }
  
}