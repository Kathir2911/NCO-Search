// Mock NCO occupation data
export const mockOccupations = [
    {
        ncoCode: '75320101',
        title: 'Sewing Machine Operator (Garment)',
        hierarchy: ['Major Group 7', 'Sub-Major Group 75', 'Minor Group 753', 'Unit Group 7532', 'Occupation 75320101'],
        description: 'Sewing machine operators operate industrial sewing machines to join, reinforce or decorate garment parts in the manufacture of garments and related articles.',
        tasks: [
            'Operating single or multi-needle industrial sewing machines',
            'Joining garment parts by sewing seams',
            'Attaching buttons, hooks, zippers and other accessories',
            'Inspecting finished garments for defects',
            'Maintaining sewing machines and replacing needles',
        ],
        relatedOccupations: [
            { ncoCode: '75320102', title: 'Overlock Machine Operator' },
            { ncoCode: '75320103', title: 'Button Hole Machine Operator' },
            { ncoCode: '74320101', title: 'Tailor (General)' },
        ],
    },
    {
        ncoCode: '25120101',
        title: 'Software Developer',
        hierarchy: ['Major Group 2', 'Sub-Major Group 25', 'Minor Group 251', 'Unit Group 2512', 'Occupation 25120101'],
        description: 'Software developers research, design, and develop computer software systems, in conjunction with hardware product development, for general use.',
        tasks: [
            'Researching, analyzing and evaluating requirements for software applications',
            'Designing, developing and integrating computer code',
            'Testing, debugging and refining computer code',
            'Writing and maintaining program documentation',
            'Evaluating and implementing new technologies',
        ],
        relatedOccupations: [
            { ncoCode: '25120102', title: 'Web Developer' },
            { ncoCode: '25120103', title: 'Mobile Application Developer' },
            { ncoCode: '25130101', title: 'Database Designer and Administrator' },
        ],
    },
    {
        ncoCode: '51210101',
        title: 'Cook (General)',
        hierarchy: ['Major Group 5', 'Sub-Major Group 51', 'Minor Group 512', 'Unit Group 5121', 'Occupation 51210101'],
        description: 'Cooks prepare and cook food in hotels, restaurants, hospitals and other establishments.',
        tasks: [
            'Planning menus and estimating food requirements',
            'Preparing and cooking food',
            'Regulating temperatures of ovens and other cooking equipment',
            'Examining food to ensure quality',
            'Supervising and training kitchen staff',
        ],
        relatedOccupations: [
            { ncoCode: '51210102', title: 'Chef' },
            { ncoCode: '51210103', title: 'Pastry Cook' },
            { ncoCode: '94120101', title: 'Kitchen Helper' },
        ],
    },
    {
        ncoCode: '23110101',
        title: 'University and Higher Education Teacher',
        hierarchy: ['Major Group 2', 'Sub-Major Group 23', 'Minor Group 231', 'Unit Group 2311', 'Occupation 23110101'],
        description: 'University and higher education teachers teach academic and vocational subjects at universities, colleges and other higher education institutions.',
        tasks: [
            'Preparing and delivering lectures and seminars',
            'Conducting tutorials and laboratory sessions',
            'Conducting research and publishing findings',
            'Supervising student research projects',
            'Assessing student work and examination papers',
        ],
        relatedOccupations: [
            { ncoCode: '23110102', title: 'College Lecturer' },
            { ncoCode: '23110103', title: 'Research Scholar' },
            { ncoCode: '23210101', title: 'Vocational Education Teacher' },
        ],
    },
    {
        ncoCode: '83210101',
        title: 'Motor Vehicle Driver',
        hierarchy: ['Major Group 8', 'Sub-Major Group 83', 'Minor Group 832', 'Unit Group 8321', 'Occupation 83210101'],
        description: 'Motor vehicle drivers drive and tend motor vehicles to transport passengers, mail and goods.',
        tasks: [
            'Driving cars, vans, trucks and other motor vehicles',
            'Checking vehicle condition and cleanliness',
            'Maintaining vehicle log books and records',
            'Loading and unloading goods',
            'Collecting fares or delivery payments',
        ],
        relatedOccupations: [
            { ncoCode: '83210102', title: 'Taxi Driver' },
            { ncoCode: '83210103', title: 'Truck Driver' },
            { ncoCode: '83220101', title: 'Bus Driver' },
        ],
    },
];

// Mock search results with confidence scores
export const mockSearchResults = (query) => {
    const lowerQuery = query.toLowerCase();

    // Simple keyword matching for demo
    const results = mockOccupations.map(occ => {
        let confidence = 0;
        let reason = '';

        if (lowerQuery.includes('sewing') || lowerQuery.includes('garment') || lowerQuery.includes('tailor')) {
            if (occ.ncoCode === '75320101') {
                confidence = 0.92;
                reason = 'Strong match: Query mentions sewing and garment work, which directly matches this occupation';
            }
        } else if (lowerQuery.includes('software') || lowerQuery.includes('developer') || lowerQuery.includes('programmer')) {
            if (occ.ncoCode === '25120101') {
                confidence = 0.95;
                reason = 'Exact match: Query directly mentions software development role';
            }
        } else if (lowerQuery.includes('cook') || lowerQuery.includes('chef') || lowerQuery.includes('kitchen')) {
            if (occ.ncoCode === '51210101') {
                confidence = 0.88;
                reason = 'Strong match: Query indicates cooking and food preparation activities';
            }
        } else if (lowerQuery.includes('teacher') || lowerQuery.includes('professor') || lowerQuery.includes('lecturer')) {
            if (occ.ncoCode === '23110101') {
                confidence = 0.85;
                reason = 'Good match: Query mentions teaching at higher education level';
            }
        } else if (lowerQuery.includes('driver') || lowerQuery.includes('driving')) {
            if (occ.ncoCode === '83210101') {
                confidence = 0.87;
                reason = 'Strong match: Query indicates vehicle driving occupation';
            }
        }

        // Add some random variation for realism
        if (confidence > 0) {
            confidence += (Math.random() * 0.05 - 0.025);
            confidence = Math.min(0.99, Math.max(0.5, confidence));
        }

        return {
            ...occ,
            confidence,
            reason,
        };
    });

    // Return only matches with confidence > 0, sorted by confidence
    return results
        .filter(r => r.confidence > 0)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5); // Top 5 results
};

// Mock synonym data
export const mockSynonyms = [
    { id: 1, synonym: 'seamstress', ncoCode: '75320101', occupation: 'Sewing Machine Operator (Garment)' },
    { id: 2, synonym: 'stitcher', ncoCode: '75320101', occupation: 'Sewing Machine Operator (Garment)' },
    { id: 3, synonym: 'programmer', ncoCode: '25120101', occupation: 'Software Developer' },
    { id: 4, synonym: 'coder', ncoCode: '25120101', occupation: 'Software Developer' },
];

// Mock audit logs
export const mockAuditLogs = [
    {
        id: 1,
        timestamp: '2025-12-22T18:30:15Z',
        action: 'SEARCH',
        user: 'enumerator_01',
        details: 'Searched for: "Sewing machine operator in garment factory"',
    },
    {
        id: 2,
        timestamp: '2025-12-22T18:30:45Z',
        action: 'SELECTION',
        user: 'enumerator_01',
        details: 'Selected occupation: 75320101 - Sewing Machine Operator (Garment)',
    },
    {
        id: 3,
        timestamp: '2025-12-22T18:31:20Z',
        action: 'SEARCH',
        user: 'enumerator_02',
        details: 'Searched for: "Software developer working on mobile apps"',
    },
    {
        id: 4,
        timestamp: '2025-12-22T18:32:10Z',
        action: 'OVERRIDE',
        user: 'admin_01',
        details: 'Override: Changed from 25120101 to 25120102 (Web Developer to Mobile Developer)',
    },
    {
        id: 5,
        timestamp: '2025-12-22T18:33:05Z',
        action: 'SYNONYM_ADD',
        user: 'admin_01',
        details: 'Added synonym: "cab driver" → 83210102 (Taxi Driver)',
    },
];

// Mock analytics
export const mockAnalytics = {
    totalSearches: 1247,
    averageConfidence: 0.87,
    lowConfidenceCases: 89,
    topOccupations: [
        { ncoCode: '75320101', title: 'Sewing Machine Operator (Garment)', count: 234 },
        { ncoCode: '25120101', title: 'Software Developer', count: 189 },
        { ncoCode: '51210101', title: 'Cook (General)', count: 156 },
    ],
};
