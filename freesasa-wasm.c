#include <stdio.h>
#include <stdlib.h>
#include "freesasa/src/freesasa.h"
#include "freesasa/src/freesasa_internal.h"

/**
 * Simulate running a stripped down version of the CLI
 *
 * @param pdb_file name of input file
 * @param output_file filename for stdout
 * @param err_file filename for stderr
 * @param optionsString can only be string represenation of FREESASA_LOG, FREESASA_RSA or FREESASA_PDB
 * */
int
freesasa_run(const char *pdb_file, const char* output_file, const char* err_file, const char *optionsString) {
    freesasa_structure *structure = NULL;
    freesasa_node *tree = NULL;
    FILE *pdb = fopen(pdb_file, "r"), *err = fopen(err_file, "w"), *out = NULL;
    int ret = FREESASA_SUCCESS;

    // pass the options as a string and not number to avoid problems with JS numbers 
    const int options = atoi(optionsString);

    if (!err) {
    	ret = FREESASA_FAIL;
    	goto cleanup;
    }

    freesasa_set_err_out(err);

    if (!pdb) {
        ret = freesasa_fail("Could not open PDB file.");
        goto cleanup;
    }

    structure = freesasa_structure_from_pdb(pdb, NULL, 0);
    fclose(pdb);

    if (!structure) {
        ret = freesasa_fail("Could not read file.");
        goto cleanup;
    }

    tree = freesasa_calc_tree(structure, NULL, pdb_file);

    if (!tree) {
        ret = freesasa_fail("Could not calculate SASA.");
        goto cleanup;
    }

    out = fopen(output_file, "w");

    if (!out) {
        ret = freesasa_fail("Could not open output file.");
        goto cleanup;
    }

    ret = freesasa_tree_export(out, tree, options);
    fclose(out);

 cleanup:
    freesasa_node_free(tree);
    freesasa_structure_free(structure);

    return ret;
}
