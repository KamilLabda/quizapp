/**
 * Script to import surveys from JSON file into MongoDB
 * Run with: npx tsx scripts/import-surveys.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import connectDB from '../src/lib/db/mongodb';
import { ObjectId } from 'mongodb';

interface Survey {
  id: string;
  title: string;
  description?: string;
  points: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions: Array<{
    id: string;
    question: string;
    type: 'text' | 'multiple-choice' | 'rating' | 'yes-no';
    options?: string[];
    required: boolean;
  }>;
}

async function importSurveys() {
  try {
    console.log('📂 Reading surveys from JSON file...');
    const surveysPath = join(process.cwd(), 'data', 'surveys.json');
    const surveysData = readFileSync(surveysPath, 'utf-8');
    const surveys: Survey[] = JSON.parse(surveysData);
    
    console.log(`✅ Found ${surveys.length} surveys in JSON file\n`);

    console.log('🔌 Connecting to MongoDB...');
    const db = await connectDB();
    const surveysCollection = db.collection('surveys');
    
    console.log('📝 Importing surveys into database...\n');

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const survey of surveys) {
      // Check if survey already exists (by id field or by title)
      const existing = await surveysCollection.findOne({
        $or: [
          { id: survey.id },
          { title: survey.title }
        ]
      });

      if (existing) {
        // Update existing survey
        await surveysCollection.updateOne(
          { _id: existing._id },
          {
            $set: {
              title: survey.title,
              description: survey.description,
              points: survey.points,
              isActive: survey.isActive,
              questions: survey.questions,
              updatedAt: new Date().toISOString(),
            }
          }
        );
        console.log(`🔄 Updated: ${survey.title}`);
        updated++;
      } else {
        // Insert new survey
        // Convert string id to ObjectId if it's a valid format, otherwise use as string
        let surveyId;
        if (ObjectId.isValid(survey.id) && survey.id.length === 24) {
          surveyId = new ObjectId(survey.id);
        } else {
          // Use the string id as is, MongoDB will generate _id
          surveyId = survey.id;
        }

        await surveysCollection.insertOne({
          id: survey.id,
          title: survey.title,
          description: survey.description,
          points: survey.points,
          isActive: survey.isActive,
          questions: survey.questions,
          createdAt: survey.createdAt || new Date().toISOString(),
          updatedAt: survey.updatedAt || new Date().toISOString(),
        });
        console.log(`✅ Imported: ${survey.title}`);
        imported++;
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   🔄 Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log('\n🎉 Survey import completed successfully!');
  } catch (error) {
    console.error('❌ Error importing surveys:', error);
    process.exit(1);
  }
}

importSurveys();

