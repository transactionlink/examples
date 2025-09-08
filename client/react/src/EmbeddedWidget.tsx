let transactionLinkReady = false;

function EmbeddedWidget() {
    const createWorkflowExecution = async (): Promise<{
        token: string;
        workflowId: string;
    }> => {
        // Create workflow execution to obtain ID and token
        // Note that a call to Transactionlink API  needs to happen server-side
        // so that you don't expose your credentials in public
        try {
            const response = await fetch('http://localhost:8101/workflow-execution', {
                method: 'POST',
            });
            const data = await response.json();
            return data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const isWorkflowFinished = async (workflowId: string): Promise<boolean> => {
        return fetch(`http://localhost:8101/workflow-status?workflowId=${workflowId}`)
            .then((response) => response.json())
            .then((data) => data.status === 'COMPLETED')
            .catch((err) => {
                console.error(err);
                return false;
            });
    };

    const launchWidget = async (): Promise<void> => {
        const { workflowId, token } = await createWorkflowExecution();

        if (!transactionLinkReady) {
            window.transactionlink_ready = async () => {
                transactionLinkReady = true;
                await openWidget(workflowId, token);
            };

            const script = document.createElement('script');
            script.src =
                'https://widget.transactionlink.io/transactionlink-widget.umd.js';
            document.head.appendChild(script);
        } else {
            await openWidget(workflowId, token);
        }
    };

    const openWidget = async (
        workflowId: string,
        token: string
    ): Promise<void> => {
        window.transactionlink!.setOptions({ token });
        window.transactionlink!.open();

        let finished = false;
        // Wait until workflow is finished - ask the server for status periodically
        while (!finished) {
            // Wait 2s between calls
            await new Promise((resolve) => setTimeout(resolve, 2000));

            finished = await isWorkflowFinished(workflowId);
        }

        // Close widget when workflow is finished
        window.transactionlink!.close();
    };

    return (
        <>
            {/* Button to trigger the widget */}
            <button onClick={launchWidget}>Launch Embedded Widget</button>

            <div id="transactionlink-widget" />
        </>
    );
}

export default EmbeddedWidget;
