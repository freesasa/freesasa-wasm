#include "freesasa/src/freesasa.h"

int
freesasa_run(const char *pdb_file, const char* output_file) {
    FILE *pdb = fopen(pdb_file, "r");
    const freesasa_structure *structure = freesasa_structure_from_pdb(pdb, NULL, 0);
    fclose(pdb);

    freesasa_node *tree = freesasa_calc_tree(structure, NULL, 0);

    FILE* out = fopen(output_file, "w");
    freesasa_tree_export(out, tree, FREESASA_LOG);
    fclose(out);

    return FREESASA_SUCCESS;
}
