const t = require("@babel/types");

module.exports = function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // If the original arrow function uses this, we bind the correct this value to the function
        if (path.node.id && path.node.id.name === "this") {
          console.log(`Converting const declaration of function with name '${path.node.id.name}' to bound function expression.`);
          path.node.declarations.forEach((decl) => {
            if (t.isArrowFunctionExpression(decl.init)) {
              decl.init.body = t.callExpression(
                t.bindExpression(
                  decl.init.body,
                  t.thisExpression()
                ),
                decl.init.params
              );
            }
          });
        }
        // Otherwise, we can simply convert the const declaration to a function declaration
        else {
          if (path.node.id && path.node.id.name === "this") {
            console.log(`Converting const declaration of function ${path.node.id.name} to function declaration.`);
          } else {
            console.log("Converting const declaration to function declaration.");
          }
          path.node.declarations.forEach((decl) => {
            console.log("decl.init:", decl.init);
            if (t.isArrowFunctionExpression(decl.init)) {
              path.replaceWith(
                t.functionDeclaration(
                  decl.id,
                  decl.init.params,
                  decl.init.body
                )
              );
            }
          });
        }
      }
    }
  };
};
