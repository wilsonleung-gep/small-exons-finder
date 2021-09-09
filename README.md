Introduction
============

One of the key steps in the [Genomics Education Partnership](https://thegep.org)
(GEP) comparative annotation strategy is to map each unique coding exon (CDS) in
the *D. melanogaster* gene model onto the project sequence of a target species.
The "Align two or more sequences" (*bl2seq*) functionality provided by the NCBI
*blastx* or *tblastn* programs are typically used to perform these searches.
Annotators can then examine each conserved region and elucidate the correct
splice sites for each CDS using the experimental and computational evidence
provided by the *GEP UCSC Genome Browser*. This strategy works well for CDSs
longer than 10 amino acids when the default scoring matrix (i.e.
[BLOSUM62](https://www.ncbi.nlm.nih.gov/blast/html/sub_matrix.html)) is used in
the *BLAST* searches.

However, the 5\' and 3\' coding exons of many *D. melanogaster* genes tend to be
much shorter than the internal coding exons. The heuristics used by the *BLAST*
algorithm (e.g., word size) means that it is difficult to identify these small
CDSs using either *blastx* or *tblastn*. In addition, *BLAST* alignments for
small exons tend to have high E-values because it is more likely for short
regions of sequence similarity to occur by chance. Hence we need to use a
different strategy to identify small CDSs in a gene model.

Since coding regions are under stronger selective pressure than untranslated
regions and intergenic regions, they tend to accumulate changes at a slower rate
than other regions of the genome. Consequently, the GEP annotation strategy will
seek to minimize the number of changes compared to the *D. melanogaster*
ortholog when we create gene models in other *Drosophila* species (i.e.
parsimony). Our past annotation experiences suggest that the CDS size in other
*Drosophila* species tend to remain similar to the size of the orthologous CDS
in *D. melanogaster*.

The [*Small Exons
Finder*](https://gander.wustl.edu/%7ewilson/smallexonfinder/index.html) is
designed to look for open reading frames that satisfy a set of biological
constraints. These constraints include the locations of adjacent CDSs and genes,
the type of CDS (i.e. initial, internal, or terminal CDS), the phases of the
splice donor and acceptor sites, and the expected CDS size according to the *D.
melanogaster* ortholog. The *Small Exons Finder* will search the genomic
sequence provided by the user and report a list of open reading frames that
satisfy these constraints.

Please see the [*Small Exons Finder* User
Guide](https://community.gep.wustl.edu/repository/documentations/Small_Exons_Finder_User_Guide.pdf)
for an overview of the program, and some examples on how to use this program in
practice.



Availability
============

The [*Small Exons
Finder*](https://gander.wustl.edu/%7ewilson/smallexonfinder/index.html) is
available under the "**Resources & Tools**" section of the [F Element project
page](https://thegep.org/felement/) and the [Pathways project
page](https://thegep.org/pathways/) on the GEP website.

