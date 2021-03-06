import React, { Component } from "react";
import Burger from "../../component/Burger/Burger";
import BuildControls from "../../component/Burger/BuildControls/BuildControls";
import OrderSummary from "../../component/Burger/OrderSummary/OrderSummary";
import Model from "../../component/UI/Model/Model";
import Axios from "../../../src/axios-orders";
import Spinner from "../../component/UI/Spinner/Spinner";
import WithErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "axios";

const INGREDIANTS_PRICE = {
  salad: 15,
  cheese: 20,
  meat: 25,
  myonnaise: 15
};

class BurgerBuilder extends Component {
  state = {
    ingrediants: null,
    totalPrice: 15,
    purchasable: false,
    purchasing: false,
    loading: false
  };

  componentDidMount() {
    console.log(this.props);
    axios
      .get("https://burgerbuilder-2e72a.firebaseio.com/ingrediants.json")
      .then((response) => {
        this.setState({ ingrediants: response.data });
      });
    console.log("fetching data...");
  }

  purchaseInfo(ing) {
    const sum = Object.keys(ing)
      .map((igkey) => {
        return ing[igkey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ purchasable: sum > 0 });
  }

  addIngHandler = (type) => {
    console.log(type);
    const oldCount = this.state.ingrediants[type];
    console.log(oldCount);
    const updatedCount = oldCount + 1;
    const updatedIngrediant = { ...this.state.ingrediants };
    updatedIngrediant[type] = updatedCount;
    console.log(updatedIngrediant);
    const priceAddition = INGREDIANTS_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = priceAddition + oldPrice;
    this.setState({ totalPrice: newPrice, ingrediants: updatedIngrediant });
    this.purchaseInfo(updatedIngrediant);
  };

  removeIngHandler = (type) => {
    const oldCount = this.state.ingrediants[type];
    console.log(oldCount);
    if (oldCount === 0) {
      alert(
        "Hey hey! " +
          type.charAt(0).toUpperCase() +
          type.slice(1) +
          " is already missing\n Add " +
          type.charAt(0).toUpperCase() +
          type.slice(1) +
          " and ENJOY YOUR BURGER."
      );
    } else {
      const updatedCount = oldCount - 1;
      const updatedIngrediant = { ...this.state.ingrediants };
      updatedIngrediant[type] = updatedCount;
      console.log(updatedIngrediant);
      const priceDeduction = INGREDIANTS_PRICE[type];
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice - priceDeduction;
      this.setState({ totalPrice: newPrice, ingrediants: updatedIngrediant });
      this.purchaseInfo(updatedIngrediant);
    }
  };
  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    const queryParams = [];
    for (let i in this.state.ingrediants) {
      queryParams.push(
        encodeURIComponent(i) +
          "=" +
          encodeURIComponent(this.state.ingrediants[i])
      );
    }
    queryParams.push("price=" + this.state.totalPrice);
    const queryString = queryParams.join("&");
    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString
    });
  };

  render() {
    const disabledInfo = { ...this.state.ingrediants };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = <Spinner />;
    console.log(this.state.ingrediants);
    if (this.state.ingrediants) {
      console.log(this.state.ingrediants);
      burger = (
        <React.Fragment>
          <Burger ingrediants={this.state.ingrediants} />
          <BuildControls
            add={this.addIngHandler}
            remove={this.removeIngHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchase={this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </React.Fragment>
      );
      orderSummary = (
        <OrderSummary
          ingrediants={this.state.ingrediants}
          purchaseContinueHandler={this.purchaseContinueHandler}
          purchaseCancelHandler={this.purchaseCancelHandler}
          price={this.state.totalPrice}
        />
      );

      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
    }
    return (
      <React.Fragment>
        <Model
          show={this.state.purchasing}
          modalClicked={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Model>
        {burger}
      </React.Fragment>
    );
  }
}

export default WithErrorHandler(BurgerBuilder, Axios);
