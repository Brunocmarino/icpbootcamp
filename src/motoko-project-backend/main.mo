import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  let numero1 : Nat = 10;
  let numero2 : Int = 20;
  let texto : Text = "Meu primeiro Dapp";

  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  public func somar(a : Nat, b : Nat) : async Nat {
        return a + b;
  };

  public func subtrair(a : Nat, b : Nat) : async Int {
      let aInt : Int = a;
      let bInt : Int = b;
      return aInt - bInt;
  };

  public func multiplicar(a : Nat, b : Nat) : async Nat {
      return a * b;
  };

};
