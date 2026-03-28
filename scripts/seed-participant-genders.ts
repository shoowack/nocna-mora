/**
 * Seeds participant gender data from the nocnamora_1_3_2026_backup.sql backup.
 * Run with: npx tsx scripts/seed-participant-genders.ts
 */

import payloadConfig from '../payload.config'
import { getPayload } from 'payload'

// Extracted from backup: slug -> gender (normalised to lowercase)
const GENDER_BY_SLUG: Record<string, 'male' | 'female' | 'transgender' | 'other'> = {
  'sead-hasanovic': 'male',
  'darko-dijanovic': 'male',
  'zoran-krivic': 'male',
  'ivan-plehan': 'male',
  'vlado-matijevic': 'male',
  'milica-stipetic': 'female',
  'nenad-blatnik': 'male',
  'stanislav-hranovic': 'male',
  'bruno-tomasic': 'transgender',
  'ivica-lako': 'male',
  'sinisa-polovina': 'male',
  'dario-dugumovic': 'male',
  'kresimir-ricijas': 'male',
  'vesna-klaic': 'female',
  'ljubomir-domesic': 'male',
  'ivo-ribar': 'male',
  'ali-milai': 'transgender',
  'remzo-krak': 'male',
  'mladen-schwartz': 'male',
  'husnija-hrustic': 'female',
  'hasan-hrustic': 'male',
  'sandra-dabo': 'female',
  'predrag-raos': 'male',
  'stjepan-spajic': 'male',
  'milan-bandic': 'male',
  'nedjeljko-badovinac': 'male',
  'darko-dugumovic': 'male',
  'slaven-letica': 'male',
  'zvonimir-levacic': 'male',
  'emir-ilijas': 'male',
  'darijan-misak': 'male',
  'sladana-petrusic': 'female',
  'nediljko-alagusic': 'male',
  'dubravka-caric': 'female',
  'zeljko-malnar': 'male',
  'davor-stern': 'male',
  'pero-kovacevic': 'male',
  'jure-zovko': 'male',
  'vinko-kalinic': 'male',
  'denis-basic': 'male',
  'vinko-coce': 'male',
  'josip-marotti': 'male',
  'miroslav-blazevic': 'male',
  'boris-miksic': 'male',
  'stjepan-bozic': 'male',
  'anto-kovacevic': 'male',
  'sasa-hindic': 'male',
  'diana-glasnova': 'female',
  'mato-arlovic': 'male',
}

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'participants',
    limit: 500,
    depth: 0,
  })

  let updated = 0
  let skipped = 0
  let notFound = 0

  for (const participant of docs) {
    const gender = GENDER_BY_SLUG[participant.slug]

    if (!gender) {
      console.log(`  ⚠ No gender data for: ${participant.slug}`)
      notFound++
      continue
    }

    if (participant.gender === gender) {
      skipped++
      continue
    }

    await payload.update({
      collection: 'participants',
      id: participant.id,
      data: { gender },
    })

    console.log(`  ✓ ${participant.slug}: ${participant.gender ?? 'null'} → ${gender}`)
    updated++
  }

  console.log(`\nDone: ${updated} updated, ${skipped} already correct, ${notFound} not in map`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
