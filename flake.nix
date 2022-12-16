{
  description = "shell for redirect-to-abstract";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
	        buildInputs = with pkgs; [ gnumake nodePackages.browserify zip ];

        in
        {
          packages.default = pkgs.stdenv.mkDerivation {
            name = "redirect-to-abstract";
            src = ./.;
            inherit buildInputs;
            outputs = [ "out" ];
            buildPhase = ''
              make build
            '';
            installPhase = ''
              make install
              mkdir -p $out/out
              ls $src
              echo mv extension/*.zip $out/out/
              mv extension/*.zip $out/out
            '';
          };
          devShell = pkgs.mkShell { inherit buildInputs; };
        }
      );
}
