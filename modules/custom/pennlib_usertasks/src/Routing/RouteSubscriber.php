<?php
/**
 * @file
 * Contains \Drupal\pennlib_usertasks\Routing\RouteSubscriber.
 */

namespace Drupal\pennlib_usertasks\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 * https://dev.acquia.com/blog/coding-drupal-8/defining-and-altering-routes-in-drupal-8/22/03/2016/9891
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  public function alterRoutes(RouteCollection $collection) {
    // Give the user page route a callback function that generates the title we want.
    // This route was generated in /core/modules/user/src/Entity/UserRouteProvider.php
    if ($route = $collection->get('entity.user.canonical')) {
      $route->setDefault('_title_callback', '\Drupal\pennlib_usertasks\Controller\PennlibUserController::userTitle');
    }
  }

}