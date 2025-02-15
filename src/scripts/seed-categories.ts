import { db } from '@/db';
import { categories } from '@/db/schema';

const categoryNames = [
    'Arts & Entertainment',
    'Autos & Vehicles',
    'Beauty & Fashion',
    'Business & Finance',
    'Comedy',
    'Education',
    'Gaming',
    'Health & Fitness',
    'Kids & Family',
    'Lifestyle',
    'Music',
    'News & Politics',
    'Science & Technology',
    'Sports',
    'Travel & Adventure',
];

async function main() {
    console.log('Seeding categories...');

    try {
        const values = categoryNames.map(name => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`,
        }));

        await db.insert(categories).values(values);

        console.log('Categories seeded successfully');
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}

main();
