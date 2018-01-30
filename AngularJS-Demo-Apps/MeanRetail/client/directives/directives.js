exports.navBar = function() {
  return {
    restrict: 'EA',
    templateUrl: '../templates/nav_bar.html',
    controller: 'NavBarController'
  };
};

exports.productsList = function() {
  return {
    restrict: 'EA',
    templateUrl: '../templates/products_list.html',
    controller: 'ProductController'
  };
};

exports.productDetails = function() {
  return {
    restrict: 'EA',
    templateUrl: '../templates/product_details.html',
    controller: 'ProductDetailsController'
  };
};

exports.categoryTree = function(){
    return {
    restrict: 'EA',
    templateUrl: '../templates/category_tree.html',
    controller: 'CategoryTreeController'
  };
};

exports.categoryProducts = function(){
    return {
    restrict: 'EA',
    templateUrl: '../templates/category_products.html',
    controller: 'CategoryProductsController'
  };
};

exports.addToCart = function(){
    return{
        restrict: 'EA',
        templateUrl: '../templates/add_to_cart.html',
        controller: 'AddToCartController'
    };
};