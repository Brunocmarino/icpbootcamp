import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";

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

  private let pessoas = Buffer.Buffer<Text>(0);

  public func adicionarPessoas(nomePessoa : Text) : async () {
      pessoas.add(nomePessoa);
  };

  public query func listarPessoas() : async [Text] {
      return Buffer.toArray(pessoas);
  };

  public query func contarPessoas() : async Nat {
      return pessoas.size();
  };

  public func limparLista() : async () {
      pessoas.clear();
  };

  public query func pessoaExiste(nome : Text) : async Bool {
      for (pessoa in pessoas.vals()) {
          if (pessoa == nome) {
              return true;
          };
      };
      return false;
  };


};
