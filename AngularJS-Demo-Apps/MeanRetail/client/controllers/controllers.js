exports.NavBarController = function($scope, $user){
  $scope.user = $user;
  
};

exports.ProductController = function($scope, $http){
   $http
   .get('/api/v1/products')
   .success(function(data){
       $scope.Products = data.products;
   } );
   
   setTimeout(function(){
       $scope.$emit('ProductController');
   }, 0 );
};

exports.ProductDetailsController = function($scope, $routeParams, $http){
    var encoded = encodeURIComponent($routeParams.id);
    $http
    .get('/api/v1/product/' + encoded)
    .success(function(data){
        $scope.product = data.product;
    } );
    setTimeout(function(){
        $scope.$emit('ProductDetailsController')
    }, 0 );
};

exports.CategoryTreeController = function($scope, $routeParams, $http){
    var encoded = encodeURIComponent($routeParams.category);
    $http
    .get('/api/v1/category/id/' + encoded)
    .success(function(data){
        $scope.category = data.category;
        
        $http
        .get('/api/v1/category/parent/' + encoded)
        .success(function(data){
            $scope.children = data.categories;
        } );
    } );
    
    setTimeout(function(){
        $scope.$emit('CategoryTreeController');
    }, 0 );
};

exports.CategoryProductsController = function($scope, $routeParams, $http){
    var encoded = encodeURIComponent($routeParams.category);
    $scope.price = undefined;
    $scope.handlePriceClick = function(){
        if($scope.price === undefined){
            $scope.price = -1;
        }else{
            $scope.price = 0 - $scope.price;
        }
        $scope.load();
    }; 
    $scope.load = function(){
        var queryParams = { price: $scope.price };
        $http
        .get('/api/v1/product/category/' + encoded, { params: queryParams } )
        .success(function(data){
            $scope.products = data.products;
        } );
    };
    $scope.load();
    setTimeout(function(){
        $scope.$emit('CategoryProductsController');
        }, 0 );
};

exports.AddToCartController = function($scope, $http, $user, $timeout){
    $scope.addToCart = function(product){
        var obj = { product: product._id, quantity: 1 };
        $user.user.data.cart.push(obj);
        
        $http
        .put('/api/v1/me/cart', { data: { cart: $user.user.data.cart } } )
        .success(function(data){
            $user.loadUser();
            $scope.success = true;
            
            $timeout(function(){
                $scope.success = false;
            }, 5000 );
        } );
    };
};