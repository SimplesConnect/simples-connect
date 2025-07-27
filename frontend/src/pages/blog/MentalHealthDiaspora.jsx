import React from 'react';
import { ArrowLeft, Heart, Brain, Users, Phone, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MentalHealthDiaspora = () => {
  const navigate = useNavigate();

  const mentalHealthChallenges = [
    {
      challenge: "Cultural Isolation",
      description: "Feeling disconnected from your cultural identity and community",
      symptoms: [
        "Loneliness despite being around people",
        "Feeling misunderstood or like an outsider",
        "Loss of cultural practices and connections",
        "Struggling to maintain traditions abroad"
      ],
      support: [
        "Join Ugandan diaspora communities online and locally",
        "Practice cultural traditions regularly, even in small ways",
        "Connect with others who share your migration experience",
        "Share your culture with new friends and colleagues"
      ]
    },
    {
      challenge: "Identity Confusion",
      description: "Uncertainty about who you are between two cultures",
      symptoms: [
        "Feeling like you don't belong anywhere fully",
        "Questioning your values and beliefs",
        "Struggling with code-switching between cultures",
        "Guilt about changing or adapting"
      ],
      support: [
        "Therapy with culturally competent counselors",
        "Join identity exploration groups for immigrants",
        "Read about others' diaspora experiences",
        "Practice self-compassion during the transition"
      ]
    },
    {
      challenge: "Family Pressure",
      description: "Stress from managing expectations across cultures",
      symptoms: [
        "Anxiety about disappointing family back home",
        "Guilt about life choices that differ from expectations",
        "Stress from financial or emotional obligations",
        "Difficulty setting boundaries with family"
      ],
      support: [
        "Family therapy that understands cultural dynamics",
        "Support groups for adult children of immigrants",
        "Communication skills training for cross-cultural families",
        "Professional help with boundary-setting"
      ]
    },
    {
      challenge: "Professional Stress",
      description: "Workplace challenges related to cultural differences",
      symptoms: [
        "Imposter syndrome in professional settings",
        "Exhaustion from constantly adapting to workplace culture",
        "Anxiety about advancement opportunities",
        "Feeling undervalued or misunderstood at work"
      ],
      support: [
        "Career counseling with diversity awareness",
        "Professional networking groups for immigrants",
        "Mentorship programs in your field",
        "Workplace discrimination resources if needed"
      ]
    }
  ];

  const resources = [
    {
      category: "Professional Mental Health",
      icon: Brain,
      resources: [
        {
          name: "Psychology Today",
          description: "Find therapists who specialize in multicultural issues",
          link: "psychologytoday.com",
          note: "Filter by 'Immigration' and 'Multicultural Counseling'"
        },
        {
          name: "National Suicide Prevention Lifeline",
          description: "24/7 crisis support in multiple languages",
          link: "988lifeline.org",
          note: "Call 988 - Free and confidential"
        },
        {
          name: "Crisis Text Line",
          description: "Text-based crisis support",
          link: "crisistextline.org",
          note: "Text HOME to 741741"
        },
        {
          name: "BetterHelp",
          description: "Online therapy with cultural competency options",
          link: "betterhelp.com",
          note: "Filter therapists by cultural background"
        }
      ]
    },
    {
      category: "Community Support",
      icon: Users,
      resources: [
        {
          name: "Local Ugandan Associations",
          description: "Cultural organizations in major cities",
          link: "Search '[Your City] Ugandan Association'",
          note: "Check Facebook and Eventbrite for local groups"
        },
        {
          name: "African Mental Health Collective",
          description: "Mental health resources for African diaspora",
          link: "africanmentalhealthcollective.com",
          note: "Culturally responsive mental health advocacy"
        },
        {
          name: "NAMI (National Alliance on Mental Illness)",
          description: "Support groups and educational resources",
          link: "nami.org",
          note: "Many chapters have multicultural programs"
        },
        {
          name: "Religious/Spiritual Communities",
          description: "Faith-based support networks",
          link: "Local churches, mosques, spiritual centers",
          note: "Many offer counseling and community support"
        }
      ]
    },
    {
      category: "Self-Care & Wellness",
      icon: Heart,
      resources: [
        {
          name: "Headspace",
          description: "Meditation and mindfulness app",
          link: "headspace.com",
          note: "Includes specific programs for stress and anxiety"
        },
        {
          name: "Shine Daily",
          description: "Mental health app designed for BIPOC communities",
          link: "shine.com",
          note: "Daily motivation and culturally relevant content"
        },
        {
          name: "Sanvello",
          description: "Anxiety and mood tracking with coping tools",
          link: "sanvello.com",
          note: "Free mood tracking and anxiety management"
        },
        {
          name: "Libby/Local Library",
          description: "Free audiobooks and ebooks on mental health",
          link: "Your local library app",
          note: "Many libraries offer free mental health resources"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-simples-cloud to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/resources')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </button>
          <div className="max-w-4xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-4">
              🔒 Safety & Support
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Mental Health Resources for the Diaspora
            </h1>
            <p className="text-xl opacity-90 mb-4">
              Finding support and maintaining mental wellness while navigating life abroad.
            </p>
            <div className="flex items-center gap-4 text-sm opacity-80">
              <span>8 min read</span>
              <span>•</span>
              <span>December 26, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Introduction */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              Mental health challenges are common for anyone living abroad, but as Ugandans in the diaspora, we face unique stressors that many traditional mental health resources don't fully understand. From cultural identity struggles to family expectations, from professional adaptation to social isolation—our mental health needs are complex and deserve culturally informed support.
            </p>
            <p className="text-lg text-simples-storm leading-relaxed mb-6">
              This guide provides practical resources and strategies specifically designed for our community. Remember: seeking mental health support isn't a sign of weakness—it's a sign of wisdom and self-care.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-800">Your Mental Health Matters</span>
              </div>
              <p className="text-red-700">
                Taking care of your mental health helps you show up better for your family, career, and community. You deserve support that understands your unique experience.
              </p>
            </div>
          </div>

          {/* Understanding Diaspora Mental Health */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Understanding Diaspora Mental Health Challenges</h2>
            
            <p className="text-simples-storm mb-6">
              Living between cultures creates specific mental health challenges that deserve recognition and appropriate support:
            </p>

            <div className="space-y-8">
              {mentalHealthChallenges.map((challenge, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-simples-midnight mb-3">{challenge.challenge}</h3>
                  <p className="text-simples-storm mb-4">{challenge.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-700 mb-3">Common Symptoms:</h4>
                      <ul className="space-y-2">
                        {challenge.symptoms.map((symptom, sIndex) => (
                          <li key={sIndex} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-simples-storm text-sm">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">Support Strategies:</h4>
                      <ul className="space-y-2">
                        {challenge.support.map((strategy, stIndex) => (
                          <li key={stIndex} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-simples-storm text-sm">{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-8">
            {resources.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-simples-midnight">{category.category}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {category.resources.map((resource, rIndex) => (
                    <div key={rIndex} className="border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-blue-800 mb-2">{resource.name}</h3>
                      <p className="text-simples-storm text-sm mb-2">{resource.description}</p>
                      <p className="text-blue-600 text-xs font-mono mb-1">{resource.link}</p>
                      <p className="text-green-700 text-xs italic">{resource.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* When to Seek Help */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">When to Seek Professional Help</h2>
            
            <p className="text-simples-storm mb-6">
              It's important to recognize when self-care isn't enough and professional support is needed:
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-amber-700 mb-4">Consider Professional Help If:</h3>
                <ul className="space-y-2 text-simples-storm text-sm">
                  <li>• You feel sad, anxious, or overwhelmed most days</li>
                  <li>• Sleep, appetite, or energy levels are significantly affected</li>
                  <li>• You're having thoughts of self-harm or suicide</li>
                  <li>• Relationships with family or friends are suffering</li>
                  <li>• Work or school performance is declining</li>
                  <li>• You're using alcohol, drugs, or other substances to cope</li>
                  <li>• You feel disconnected from activities you used to enjoy</li>
                  <li>• Cultural stress is overwhelming your daily life</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-4">Types of Professional Support:</h3>
                <ul className="space-y-3 text-simples-storm text-sm">
                  <li>
                    <strong>Therapists/Counselors:</strong> Individual therapy for personal challenges
                  </li>
                  <li>
                    <strong>Psychiatrists:</strong> Medical doctors who can prescribe medication if needed
                  </li>
                  <li>
                    <strong>Cultural Specialists:</strong> Mental health professionals who understand immigrant experiences
                  </li>
                  <li>
                    <strong>Group Therapy:</strong> Support groups with others facing similar challenges
                  </li>
                  <li>
                    <strong>Family Counselors:</strong> Help with family dynamics across cultures
                  </li>
                  <li>
                    <strong>Career Counselors:</strong> Support for work-related stress and professional development
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Crisis Resources</h4>
              <p className="text-red-700 text-sm mb-2">
                If you're having thoughts of suicide or self-harm, get help immediately:
              </p>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• <strong>Call 988</strong> - National Suicide Prevention Lifeline (24/7, free)</li>
                <li>• <strong>Text HOME to 741741</strong> - Crisis Text Line</li>
                <li>• <strong>Go to your nearest emergency room</strong></li>
                <li>• <strong>Call 911</strong> if you're in immediate danger</li>
              </ul>
            </div>
          </div>

          {/* Finding Culturally Competent Care */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Finding Culturally Competent Mental Health Care</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Questions to Ask Potential Therapists:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">About Cultural Competency:</h4>
                    <ul className="text-simples-storm text-sm space-y-1">
                      <li>• Have you worked with African immigrants before?</li>
                      <li>• Do you understand the unique challenges of diaspora life?</li>
                      <li>• How do you approach family dynamics in collectivist cultures?</li>
                      <li>• Are you familiar with cultural identity struggles?</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">About Treatment Approach:</h4>
                    <ul className="text-simples-storm text-sm space-y-1">
                      <li>• What is your approach to therapy?</li>
                      <li>• How do you incorporate cultural values into treatment?</li>
                      <li>• Do you work with interpreters if needed?</li>
                      <li>• How do you handle religious/spiritual aspects of mental health?</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Red Flags to Avoid:</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <ul className="text-red-700 text-sm space-y-2">
                    <li>• Dismissing cultural factors as unimportant</li>
                    <li>• Encouraging you to "just assimilate" without acknowledging loss</li>
                    <li>• Making assumptions about your culture without asking</li>
                    <li>• Suggesting that family involvement is always unhealthy</li>
                    <li>• Showing discomfort with discussing cultural identity</li>
                    <li>• Pushing Western therapeutic models without cultural adaptation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Building Community Support */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Building Your Mental Health Support Network</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3">Professional Support Team</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• Primary care doctor (for overall health)</li>
                  <li>• Mental health therapist (for ongoing support)</li>
                  <li>• Psychiatrist (if medication is helpful)</li>
                  <li>• Cultural/spiritual advisor (if relevant to you)</li>
                  <li>• Support group facilitator</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-3">Personal Support Network</h3>
                <ul className="space-y-2 opacity-90 text-sm">
                  <li>• Other Ugandans who understand your experience</li>
                  <li>• Trusted friends who listen without judgment</li>
                  <li>• Family members (those who are supportive)</li>
                  <li>• Mentors in your professional or personal life</li>
                  <li>• Online communities for diaspora mental health</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Daily Mental Health Practices */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Daily Practices for Mental Wellness</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-3">Cultural Connection</h3>
                <ul className="text-simples-storm text-sm space-y-2">
                  <li>• Listen to Ugandan music daily</li>
                  <li>• Call family/friends back home regularly</li>
                  <li>• Cook traditional foods</li>
                  <li>• Practice Luganda or your local language</li>
                  <li>• Follow Ugandan news and culture online</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-3">Stress Management</h3>
                <ul className="text-simples-storm text-sm space-y-2">
                  <li>• Practice deep breathing exercises</li>
                  <li>• Try meditation or mindfulness apps</li>
                  <li>• Regular physical exercise</li>
                  <li>• Maintain consistent sleep schedule</li>
                  <li>• Journal about your experiences</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-simples-midnight mb-3">Social Wellness</h3>
                <ul className="text-simples-storm text-sm space-y-2">
                  <li>• Schedule regular social activities</li>
                  <li>• Join clubs or groups with shared interests</li>
                  <li>• Volunteer in your community</li>
                  <li>• Attend cultural events and gatherings</li>
                  <li>• Build friendships across different cultures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Breaking Mental Health Stigma */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-simples-midnight mb-6">Breaking Mental Health Stigma in Our Community</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-simples-midnight mb-4">Common Misconceptions vs. Reality</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">❌ Misconception</h4>
                      <p className="text-red-700 text-sm">"Mental health problems are a sign of weak faith or character"</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Reality</h4>
                      <p className="text-green-700 text-sm">Mental health challenges are medical conditions that can affect anyone, regardless of faith or character strength</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">❌ Misconception</h4>
                      <p className="text-red-700 text-sm">"Seeking therapy means you've failed or your family has failed"</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Reality</h4>
                      <p className="text-green-700 text-sm">Seeking help shows wisdom and strength; it's an investment in your wellbeing and your ability to support others</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">❌ Misconception</h4>
                      <p className="text-red-700 text-sm">"Mental health issues don't exist in African cultures"</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Reality</h4>
                      <p className="text-green-700 text-sm">Mental health challenges exist across all cultures; traditional healing and modern therapy can work together</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Mental Health Journey Matters</h2>
            <p className="text-lg opacity-90 mb-4">
              Taking care of your mental health as a Ugandan in the diaspora isn't selfish—it's essential. When you're mentally healthy, you can better support your family, excel in your career, and contribute positively to both your local and Ugandan communities.
            </p>
            <p className="text-lg opacity-90">
              Remember: seeking help is a sign of strength, not weakness. You deserve support that understands and honors your unique experience.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center mt-8">
            <h3 className="text-xl font-bold text-simples-midnight mb-4">Take the First Step Today</h3>
            <p className="text-simples-storm mb-6">
              Your mental health is worth investing in. Start with one small step—whether that's reaching out to a friend, exploring a resource, or scheduling an appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/discover')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Find Support Community
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="border border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Explore More Resources
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MentalHealthDiaspora; 