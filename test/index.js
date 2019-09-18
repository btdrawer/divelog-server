/* Each set of CRU functions are tested first,
followed by deletion at the end (./delete.js).
This is so data created in each file can be used
for testing in the subsequent file(s). */
require('./user_cru');
require('./gear');
//require('./club');
require('./friend');
//require('./message'); //Breaks other tests*/
require('./user_d');