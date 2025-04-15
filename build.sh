
FANX_DIR=../fanx/release/fanx-4.2.0

${FANX_DIR}/bin/fan compilerDoc -all
cp -r ${FANX_DIR}/doc/* apidoc/

cd src
fan build.fan
cd -
