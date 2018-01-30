var express = require('express');

var status = require('http-status');
var _ = require('underscore');
var helper = require('../services/helper');

module.exports = function(wagner){
    var api = express.Router();
    
	
    api.get('/products', wagner.invoke(function(Product){
        return function(req, res){
            var sort = { name: 1 };
            Product
            .find( {} )
            .sort(sort)
            .exec(function(error, products){
                if(error){
                    res.status(500).send(error);
                }
                res.json( { products: products } );
                
            } ); 
        };
    } ) );
    
   api.get('/product/:id', wagner.invoke(function(Product){
       return function(req, res){
           Product
           .findOne({_id: req.params.id}, function(error, product){
               if(error){
                   res.status(500).send('Nomething Went Wrong !');
               }
               res.json( { product: product } );
           } );
          
       };
   } ) );
   
    api.get('/category/id/:id', wagner.invoke(function(Category){
        return function(req, res){
            Category
            .findOne( { _id: req.params.id })
            .exec(helper.handleOne.bind(null, 'category', res) );
        };
    } ) );
    
    api.get('/category/parent/:id', wagner.invoke(function(Category){
        return function(req, res){
            Category
            .find( { parent: req.params.id } )
            .sort( {_id: 1} )
            .exec(helper.handleMany.bind(null, 'categories', res) );
        };
    } ) );
    
    api.get('/product/category/:id', wagner.invoke(function(Product){
        return function(req, res){
            var sort = { name: 1 };
            if(req.query.price === "1"){
                sort = { 'internal.approximatePriceUSD': 1 };
            }else if(req.query.price === "-1"){
                sort = { 'internal.approximatePriceUSD': -1 };
            }
            
            Product
            .find( { 'category.ancestors': req.params.id } )
            .sort(sort)
            .exec(helper.handleMany.bind(null, 'products', res) );
        };
    } ) );
    
   
    
    api.put('/me/cart', wagner.invoke(function(User){
        return function(req, res){
            try{
                var cart = req.body.data.cart;
            }catch(e){
                return res
                    .status(status.BAD_REQUEST)
                    .json( { error: 'No Cart Specified !' } );       
            }
            
        req.user.data.cart = cart;
        req.user.save(function(error, user){
            if(error){
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json( { error: error.toString() } );
            }
            return res.json( { user: user } );
        } );
        };
    } ) );
    
    api.get('/me', wagner.invoke(function(User){
    return function(req, res){
      if(!req.user){
        return res.
          status(status.UNAUTHORIZED).
          json({ error: 'Not logged in'});
      }

      req.user.populate(
        { path: 'data.cart.product', model: 'Product' },
        handleOne.bind(null, 'user', res));
    };
    }));

    api.post('/checkout', wagner.invoke(function(User, Stripe){
        return function(req, res){
            if(!req.user){
                return res
                    .status(status.UNAUTHORIZED)
                    .json( { error: 'Not Loged In !' } );
        }
        req.user.populate(
        {path: 'data.cart.product', model: 'Product' },
        function(error, user){
            var totalCostUSD = 0;
            _.each('user.data.cart', function(item){
                totalCostUSD = item.product.internal.approximatePriceUSD * item.quantity;
            } );
            Stripe.charges.create(
               {
                    amount: Math.ceil(totalCostUSD * 100),
                    source: req.body.StripeToken,
                    currency: 'usd',
                    description: 'Example Charges !'
                },
                function(error, charge){
                    if(error && error.type === 'StripeCardError'){
                        return res
                        .status(status.BAD_REQUEST)
                        .json( { error: error.toString() } );
                    }
                    if(error){
                        return res
                        .status(status.INTERNAL_SERVER_ERROR)
                        .json( { error: error.toString() } );

                    }
                    req.user.data.cart = [];
                    req.user.save(function(error, user){
                        return res.json( { id: charge._id } );
                    });     
                });
            });
        };
    } ) );
    
    return api;
};

handleOne = function(property, res, error, doc){
  if(error){
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if(!doc){
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found'});
  }

  var json = {};
  json[property] = doc;
  res.json(json);
};