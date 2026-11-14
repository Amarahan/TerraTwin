// Snapshot the existing local module only; this does not calculate or approve scores.
import {CANDIDATE_SITES,TARGET_MODELS} from '../../starter_app/src/candidateData.ts';
import {DEFAULT_WEIGHT_PROFILES,DEFAULT_RELATED_ROCK_GROUPS,MINIMUM_WEIGHTED_COVERAGE,WEIGHT_SUM_TOLERANCE} from '../../starter_app/src/scoring.ts';
process.stdout.write(JSON.stringify({sites:CANDIDATE_SITES,targets:TARGET_MODELS,model:{weights:DEFAULT_WEIGHT_PROFILES,related_rock_groups:DEFAULT_RELATED_ROCK_GROUPS,minimum_weighted_coverage:MINIMUM_WEIGHTED_COVERAGE,weight_sum_tolerance:WEIGHT_SUM_TOLERANCE}}));
