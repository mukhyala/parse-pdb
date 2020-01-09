const yargs = require('yargs');

const argv = yargs
    .command('binding_pocket', 'defines the binding pocket', {
	    pdb: {
		description: 'the PDB file to use',
		alias: 'p',
		type: 'string',
		demandOption: true
	    },
	    dist: {
		description: "distance cutoff",
		alias: 'd',
		type: 'number',
		demandOption: true
	    },
	    lig: {
	    alias: 'l',
	    description: 'the ligand ID from the PDB file to use',
	    type: 'string',
	    demandOption: true
	}
	})
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .alias('help', 'h')
    .argv;

pdbFile = argv.pdb;
ligandID = argv.lig;
dist = argv.dist;

const parsePdb = require('parse-pdb');
const { readFileSync } = require('fs');
const pdbString = readFileSync(pdbFile, 'utf8');
const parsed = parsePdb(pdbString);

function byDistance(a) {
    ligAtoms=this.atoms
    for(index=0; index < ligAtoms.length; index++) {
	lig = ligAtoms[index];
	dx = a.xloc - lig.xloc;
	dy = a.yloc - lig.yloc;
	dz = a.zloc - lig.zloc;
	dist = Math.sqrt( dx * dx + dy * dy + dz * dz );
	return dist < this.distance;
    }
}

ligAtoms = parsed.hetatoms.filter(item => item.resName === ligandID);

pocketAtoms = parsed.atoms.filter(byDistance,{atoms:ligAtoms,distance:dist});

console.log(pocketAtoms)
