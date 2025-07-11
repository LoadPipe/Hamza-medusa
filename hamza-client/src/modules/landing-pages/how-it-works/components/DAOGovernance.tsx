import type React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@modules/landing-pages/how-it-works/components/ui/card';
import { Progress } from '@modules/landing-pages/how-it-works/components/ui/progress';
import {
    Vote,
    ArrowRight,
    ThumbsUp,
    ThumbsDown,
    Clock,
    Users,
} from 'lucide-react';

interface Proposal {
    id: string;
    title: string;
    description: string;
    votesFor: number;
    votesAgainst: number;
    endTime: string;
    proposer: string;
    status: 'active' | 'passed' | 'rejected';
}

interface DAOGovernanceProps {
    proposals: Proposal[];
    translate: (key: string, lang?: string) => string;
    selectedLanguage: string;
}

const DAOGovernance: React.FC<DAOGovernanceProps> = ({
    proposals,
    translate,
    selectedLanguage,
}) => {
    const formatTimeLeft = (endTime: string) => {
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        return `${days}d ${hours}h`;
    };

    const calculatePercentage = (votesFor: number, votesAgainst: number) => {
        const total = votesFor + votesAgainst;
        return total === 0 ? 0 : (votesFor / total) * 100;
    };

    const getStatusColor = (status: 'active' | 'passed' | 'rejected') => {
        switch (status) {
            case 'active':
                return 'bg-blue-500';
            case 'passed':
                return 'bg-green-500';
            case 'rejected':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card className="bg-black border border-gray-800 max-w-[1200px] mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
                    <div className="flex items-center">
                        <Vote className="mr-2 h-6 w-6 text-[#BB86FC]" />
                        {translate('DAO Governance', selectedLanguage)}
                    </div>
                    <button
                        onClick={() => {
                            /* Add your logic here */
                        }}
                        className="text-[#BB86FC] hover:text-[#9D4EDD] transition-colors text-sm flex items-center"
                    >
                        {translate('View All Proposals', selectedLanguage)}
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {proposals.slice(0, 2).map((proposal) => (
                    <div
                        key={proposal.id}
                        className="bg-gray-900 rounded-lg p-4 space-y-4"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {translate(
                                        proposal.title,
                                        selectedLanguage
                                    )}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {translate(
                                        proposal.description,
                                        selectedLanguage
                                    )}
                                </p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}
                            >
                                {translate(proposal.status, selectedLanguage)}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{proposal.proposer}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{formatTimeLeft(proposal.endTime)}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Progress
                                value={calculatePercentage(
                                    proposal.votesFor,
                                    proposal.votesAgainst
                                )}
                                className="h-2 w-full bg-gray-700"
                            />
                            <div className="flex justify-between text-sm">
                                <span className="text-green-400">
                                    {translate('For', selectedLanguage)}:{' '}
                                    {proposal.votesFor}
                                </span>
                                <span className="text-red-400">
                                    {translate('Against', selectedLanguage)}:{' '}
                                    {proposal.votesAgainst}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                <button className="p-2 bg-gray-800 text-green-400 rounded hover:bg-gray-700 transition-colors">
                                    <ThumbsUp className="h-4 w-4" />
                                </button>
                                <button className="p-2 bg-gray-800 text-red-400 rounded hover:bg-gray-700 transition-colors">
                                    <ThumbsDown className="h-4 w-4" />
                                </button>
                            </div>
                            <button className="text-[#BB86FC] hover:text-[#9D4EDD] transition-colors text-sm">
                                {translate('View Details', selectedLanguage)}
                            </button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default DAOGovernance;
